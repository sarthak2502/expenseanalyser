package com.example.fullstackapp.exception;

public class ExpenseFileNotFoundException extends RuntimeException {

    public ExpenseFileNotFoundException(Long id) {
        super("Expense file not found with id: " + id);
    }
}
