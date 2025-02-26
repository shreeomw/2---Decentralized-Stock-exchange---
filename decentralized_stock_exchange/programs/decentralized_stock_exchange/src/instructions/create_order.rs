use anchor_lang::prelude::*;
use crate::state::{OrderBook, MarketAccount};

pub fn handle_order(
    ctx: Context<PlaceOrder>,
    quantity: u64,
    price: u64,
    order_type: u8,
) -> Result<()> {
    let order = &mut ctx.accounts.order;
    order.owner = ctx.accounts.owner.key();
    order.quantity = quantity;
    order.price = price;
    order.order_type = order_type;
    
    Ok(())
}

#[derive(Accounts)]
pub struct PlaceOrder<'info> {
    #[account(mut)]
    pub market: Account<'info, MarketAccount>,
    
    #[account(
        init,
        payer = owner,
        space = OrderBook::LEN // Ensure this is correctly calculating the space for the `OrderBook` struct
    )]
    pub order: Account<'info, OrderBook>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}
