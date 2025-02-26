use anchor_lang::prelude::*;

pub const PRODUCT: &str = "stock";

pub mod util;

pub fn get_index(vec: &Vec<bool>) -> usize {
    vec.iter().position(|&x| !x).unwrap_or(vec.len())
}

pub fn pda_transfer() -> Result<()> {
    Ok(())
}
