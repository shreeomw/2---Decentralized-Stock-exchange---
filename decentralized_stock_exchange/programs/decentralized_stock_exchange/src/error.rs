// Create new file: programs/decentralized_stock_exchange/src/error.rs

use anchor_lang::prelude::*;

#[error_code]
pub enum StockError {
    #[msg("Insufficient stock balance")]
    InsufficientStockBalance,
    #[msg("Invalid offer amount")]
    InvalidOfferAmount,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid price")]
    InvalidPrice,
}