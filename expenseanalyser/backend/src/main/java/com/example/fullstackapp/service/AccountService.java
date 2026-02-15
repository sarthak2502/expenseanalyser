package com.example.fullstackapp.service;

import com.example.fullstackapp.dto.AccountDto;

import java.util.List;

public interface AccountService {

    AccountDto createAccount(AccountDto accountDto);

    List<AccountDto> getAllAccounts();

    AccountDto getAccountById(Long id);

    AccountDto updateAccount(Long id, AccountDto accountDto);

    void deleteAccount(Long id);
}
