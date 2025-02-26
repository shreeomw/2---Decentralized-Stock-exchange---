use anchor_lang::prelude::*;
use crate::state::{Stock, Offer};

#[derive(Accounts)]
pub struct AcceptBuyOffer<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    /// CHECK: This account's address is checked in the offer account constraints
    #[account(
        mut,
        constraint = buyer.key() == offer.owner
    )]
  

    pub buyer: AccountInfo<'info>,
    
    #[account(
        mut,
        constraint = stock.owner == seller.key()
    )]

    pub stock: Account<'info, Stock>,
    
    #[account(
        mut,
        close = buyer,
        constraint = offer.stock == stock.key(),
        constraint = offer.amount > 0
    )]

    pub offer: Account<'info, Offer>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum DexError {
    #[msg("Arithmetic overflow occurred")]
    ArithmeticOverflow,
    #[msg("Insufficient funds")]
    InsufficientFunds,
}

pub fn handle(ctx: Context<AcceptBuyOffer>) -> Result<()> {
    let stock = &mut ctx.accounts.stock;
    let offer = &ctx.accounts.offer;
    
    // Calculate total payment amount
    let total_payment = offer.amount.checked_mul(offer.price)
        .ok_or(DexError::ArithmeticOverflow)?; // ✅ Use custom error

    // Check if the buyer has enough funds
    let buyer_balance = **ctx.accounts.buyer.lamports.borrow();
    if buyer_balance < total_payment {
        return Err(DexError::InsufficientFunds.into()); // ✅ Use custom error
    }

    // Transfer payment from buyer to seller
    **ctx.accounts.buyer.try_borrow_mut_lamports()? -= total_payment;
    **ctx.accounts.seller.try_borrow_mut_lamports()? += total_payment;

    // Transfer stock ownership to the buyer
    stock.owner = ctx.accounts.buyer.key();
    
    Ok(())
}
