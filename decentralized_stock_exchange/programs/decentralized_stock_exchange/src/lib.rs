use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod error;

use instructions::create_stock::*;
use instructions::create_offer::*;
use instructions::accept_a_buy::*;

use instructions::create_market::*;
use instructions::create_order::*;
use instructions::cancel_offer::*;
use crate::instruction::CreateMarket; // Ensure this line imports the correct handler

// Declare the program ID
declare_id!("43fWv3Y8kAkN7tnEDTVQwpWNqQt1ivpKsjbjHksu7kWz");

#[program]
pub mod decentralized_stock_exchange {
 use super::*;

 // Create Stock Instruction
 pub fn create_stock(
 ctx: Context<CreateStock>,
 name: String,
 symbol: String,
 total_supply: u64,
 current_price: u64,
 ) -> Result<()> {
 // Call the handler for creating stock
 instructions::create_stock_handler(ctx, name, symbol, total_supply, current_price)
 }

 // Create Offer Instruction
 pub fn create_offer(
 ctx: Context<CreateOffer>,
 amount: u64,
 price: u64,
 ) -> Result<()> {
 // Call the handler for creating an offer
 instructions::create_offer_handler(ctx, amount, price)
 }

 // Accept Buy Offer Instruction
 pub fn accept_buy_offer(ctx: Context<AcceptBuyOffer>) -> Result<()> {
 // Call the handler for accepting a buy offer
 instructions::handle(ctx)
 }

 pub fn create_market<CreateMarket>(
    ctx: Context<CreateMarket>, 
    name: String, 
    symbol: String, 
    initial_supply: u64, 
    base_price:u64
) -> Result<()> {
    // Call the handler for creating a market
    instructions::handle_market(ctx, name, symbol, initial_supply, base_price)
 }
 pub fn create_order<PlaceOrder>(
    ctx: Context<PlaceOrder>, 
    quantity: u64, 
    price: u64, 
    order_type:u8
) -> Result<()> {
    // Call the handler for creating an order
    instructions::handle_order(ctx, quantity, price, order_type)
 }
    pub fn cancel_offer(ctx: Context<CancelOffer>) -> Result<()> {
        // Call the handler for canceling an order
        instructions::handle_cancel_offer(ctx)
    }
}