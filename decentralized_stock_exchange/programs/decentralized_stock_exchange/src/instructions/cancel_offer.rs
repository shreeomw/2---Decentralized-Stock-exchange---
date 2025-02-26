use anchor_lang::prelude::*;
use crate::state::{Stock, Offer};

#[derive(Accounts)]
pub struct CancelOffer<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = offer.owner == user.key(),
        close = user
    )]

    pub offer: Account<'info, Offer>,

    #[account(
        mut,
        constraint = stock.key() == offer.stock
    )]

    pub stock: Account<'info, Stock>,

    pub system_program: Program<'info, System>,
}

pub fn handle_cancel_offer(_ctx: Context<CancelOffer>) -> Result<()> {
    // No additional logic is needed as the constraints handle the closure and transfers
    Ok(())
}
