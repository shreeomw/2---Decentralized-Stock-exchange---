use anchor_lang::prelude::*;
use crate::state::MarketAccount;

pub fn handle_market(
    ctx: Context<CreateMarket>,
    name: String,
    symbol: String,
    initial_supply: u64,
    base_price: u64,
) -> Result<()> {
    let market = &mut ctx.accounts.market;
    market.name = name;
    market.symbol = symbol;
    market.initial_supply = initial_supply;
    market.base_price = base_price;
    market.authority = ctx.accounts.authority.key();
    
    Ok(())
}

#[derive(Accounts)]
pub struct CreateMarket<'info> {
    #[account(
        init,
        payer = authority,
        space = MarketAccount::LEN // Make sure this returns the correct space size for your `MarketAccount` struct
    )]
    pub market: Account<'info, MarketAccount>,
    
    #[account(mut)]
    pub authority: Signer<'info>,  // This account must pay for the creation of the market
    pub system_program: Program<'info, System>,
}
