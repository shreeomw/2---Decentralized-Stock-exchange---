use anchor_lang::prelude::*;

#[account]
pub struct Stock {
    pub name: String,
    pub symbol: String,
    pub total_supply: u64,
    pub current_price: u64,
    pub owner: Pubkey,
}

impl Stock {
    pub const LEN: usize = 8 + // discriminator
        32 + // name (max length)
        8 + // symbol (max length)
        8 + // total_supply
        8 + // current_price
        32; // owner (Pubkey)
}

#[account]
pub struct Offer {
    pub stock: Pubkey,
    pub amount: u64,
    pub price: u64,
    pub owner: Pubkey,
}

impl Offer {
    pub const LEN: usize = 8 + // discriminator
        32 + // stock (Pubkey)
        8 + // amount
        8 + // price
        32; // owner (Pubkey)
}