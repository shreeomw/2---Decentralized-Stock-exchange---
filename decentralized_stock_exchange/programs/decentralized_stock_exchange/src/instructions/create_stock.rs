use anchor_lang::prelude::*;
use crate::state::Stock;

pub fn create_stock_handler(
    ctx: Context<CreateStock>,
    name: String,
    symbol: String,
    total_supply: u64,
    current_price: u64,
) -> Result<()> {
    let stock = &mut ctx.accounts.stock;
    stock.name = name;
    stock.symbol = symbol;
    stock.total_supply = total_supply;
    stock.current_price = current_price;
    stock.owner = ctx.accounts.user.key();
    
    Ok(())
}

#[derive(Accounts)]
pub struct CreateStock<'info> {
    #[account(
        init,
        payer = user,
        space = Stock::LEN // Make sure this is the correct size for your struct
    )]
    pub stock: Account<'info, Stock>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
