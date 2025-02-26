use anchor_lang::prelude::*;
use crate::state::{MarketAccount, OrderBook};

pub fn handle_buy(
    ctx: Context<ExecuteBuyOrder>,
    quantity: u64,
) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let order = &mut ctx.accounts.order;
    let buyer = &mut ctx.accounts.buyer;

    // Validate that the order is a "buy" order
    require_eq!(order.order_type, 1, CustomError::InvalidOrderType); // Assuming 1 is for buy orders

    // Ensure the buyer has enough funds for the transaction
    let total_price = order.price.checked_mul(quantity)
        .ok_or(ProgramError::ArithmeticOverflow)?;

    // Check if the buyer has enough funds
    let buyer_balance = buyer.to_account_info().lamports();
    require!(buyer_balance >= total_price, CustomError::InsufficientFunds);

    // Decrease the quantity of the order
    if order.quantity <= quantity {
        // Order fully filled, remove it from the order book
        market.remove_order(order.key());
    } else {
        // Partially filled, decrease the order quantity
        order.quantity -= quantity;
    }

    // Transfer funds (buyer -> seller)
    anchor_lang::solana_program::program::invoke(
        &system_instruction::transfer(
            &buyer.key(),
            &ctx.accounts.seller.key(),
            total_price,
        ),
        &[
            buyer.to_account_info(),
            ctx.accounts.seller.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    Ok(())
}

pub fn handle_sell(
    ctx: Context<ExecuteSellOrder>,
    quantity: u64,
) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let order = &mut ctx.accounts.order;
    let seller = &mut ctx.accounts.seller;

    // Validate that the order is a "sell" order
    require_eq!(order.order_type, 2, CustomError::InvalidOrderType); // Assuming 2 is for sell orders

    // Ensure the seller has enough stock
    let seller_stock = seller.to_account_info().lamports(); // Replace with stock checking
    require!(seller_stock >= quantity, CustomError::InsufficientStock);

    // Decrease the quantity of the order
    if order.quantity <= quantity {
        // Order fully filled, remove it from the order book
        market.remove_order(order.key());
    } else {
        // Partially filled, decrease the order quantity
        order.quantity -= quantity;
    }

    // Transfer stock (seller -> buyer)
    // This logic will depend on your stock transfer mechanism, which is assumed to be handled elsewhere.

    // Optionally transfer funds from buyer to seller (or handle via external logic)
    Ok(())
}

#[derive(Accounts)]
pub struct ExecuteBuyOrder<'info> {
    #[account(mut)]
    pub market: Account<'info, MarketAccount>,
    
    #[account(mut)]
    pub order: Account<'info, OrderBook>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    #[account(mut)]
    pub seller: Account<'info, MarketAccount>, // Assuming seller is a MarketAccount for now
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteSellOrder<'info> {
    #[account(mut)]
    pub market: Account<'info, MarketAccount>,
    
    #[account(mut)]
    pub order: Account<'info, OrderBook>,
    
    #[account(mut)]
    pub seller: Signer<'info>,
    
    #[account(mut)]
    pub buyer: Account<'info, MarketAccount>, // Assuming buyer is a MarketAccount for now
    
    pub system_program: Program<'info, System>,
}

// Custom error for invalid order type, insufficient funds, etc.
#[error]
pub enum CustomError {
    #[msg("Invalid order type")]
    InvalidOrderType,
    
    #[msg("Insufficient funds")]
    InsufficientFunds,
    
    #[msg("Insufficient stock")]
    InsufficientStock,
}
