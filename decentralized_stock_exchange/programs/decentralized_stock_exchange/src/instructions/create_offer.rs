use anchor_lang::prelude::*;
use crate::state::{Offer, Stock};

pub fn create_offer_handler(
    ctx: Context<CreateOffer>,
    amount: u64,
    price: u64,
) -> Result<()> {
    let offer = &mut ctx.accounts.offer;
    offer.stock = ctx.accounts.stock.key();
    offer.amount = amount;
    offer.price = price;
    offer.owner = ctx.accounts.user.key();
    
    Ok(())
}

#[derive(Accounts)]
pub struct CreateOffer<'info> {
    #[account(
        init,
        payer = user,
        space = Offer::LEN // Ensure this returns the correct space size for your `Offer` struct
    )]
    pub offer: Account<'info, Offer>,
    
    /// The stock account this offer is for
    #[account(
        constraint = stock.owner == user.key() // Optional: Ensure that the user is the owner of the stock
    )]

    pub stock: Account<'info, Stock>,
    
    #[account(mut)]
    pub user: Signer<'info>,  // User who is creating the offer
    pub system_program: Program<'info, System>,
}
