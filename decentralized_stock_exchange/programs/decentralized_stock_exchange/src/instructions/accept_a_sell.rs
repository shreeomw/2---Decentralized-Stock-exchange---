use anchor_lang::{prelude::*, solana_program::*};
use crate::state::*;
use crate::utils::get_price_index;

pub fn execute_buy_order(ctx: Context<ExecuteBuyOrder>, quantity: u64) -> Result<()> {
    // 1. Validate the transaction
    require_keys_eq!(
        ctx.accounts.market_pda.key(),
        ctx.accounts.market_account.key(),
    );
    require_keys_eq!(ctx.accounts.sell_order.key(), ctx.accounts.order_pda.key());
    
    let price_index = get_price_index(ctx.accounts.sell_order.price_levels.clone());
    require_eq!(quantity, ctx.accounts.sell_order.quantities[price_index]);

    // 2. Execute payment transfer
    anchor_lang::solana_program::program::invoke(
        &system_instruction::transfer(
            &ctx.accounts.buyer.key(),
            &ctx.accounts.sell_order.key(),
            ctx.accounts.sell_order.price_levels[price_index],
        ),
        &[
            ctx.accounts.buyer.to_account_info(),
            ctx.accounts.sell_order.to_account_info(), // Corrected from 'order_pda'
        ],
    )?;

    // 3. Update market state
    let market = &mut ctx.accounts.market;
    let seller = &mut ctx.accounts.seller_position;
    let buyer = &mut ctx.accounts.buyer_position;
    let order = &mut ctx.accounts.sell_order;

    market.update_trade_history();
    market.decrease_open_orders();
    
    seller.decrease_position(order.quantities[price_index]);
    buyer.increase_position(order.quantities[price_index]);
    
    // 4. Update order book
    order.remove_order_at(price_index);

    Ok(())
}

#[derive(Accounts)]
pub struct ExecuteBuyOrder<'info> {
    #[account(mut)]
    pub market: Account<'info, MarketState>,

    /// CHECK: Validated in business logic
    pub market_pda: UncheckedAccount<'info>,

    #[account(mut)]
    pub sell_order: Account<'info, OrderEntry>,

    /// CHECK: Validated in business logic
    pub order_pda: UncheckedAccount<'info>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    pub system_program: Program<'info, System>,

    #[account(mut)]
    pub seller_position: Account<'info, Position>, // Account for the seller's position

    #[account(mut)]
    pub buyer_position: Account<'info, Position>, // Account for the buyer's position
}
