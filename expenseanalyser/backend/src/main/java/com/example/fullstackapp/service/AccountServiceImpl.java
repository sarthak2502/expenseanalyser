package com.example.fullstackapp.service;

import com.example.fullstackapp.dto.AccountDto;
import com.example.fullstackapp.entity.Account;
import com.example.fullstackapp.exception.AccountNotFoundException;
import com.example.fullstackapp.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    @Override
    public AccountDto createAccount(AccountDto accountDto) {
        Account account = toEntity(accountDto);
        account.setId(null);
        Account saved = accountRepository.save(account);
        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountDto> getAllAccounts() {
        return accountRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AccountDto getAccountById(Long id) {
        Account account = accountRepository.findById(id).orElseThrow(() -> new AccountNotFoundException(id));
        return toDto(account);
    }

    @Override
    public AccountDto updateAccount(Long id, AccountDto accountDto) {
        Account existing = accountRepository.findById(id).orElseThrow(() -> new AccountNotFoundException(id));
        existing.setAccountName(accountDto.getAccountName());
        existing.setAccountType(accountDto.getAccountType());
        return toDto(accountRepository.save(existing));
    }

    @Override
    public void deleteAccount(Long id) {
        if (!accountRepository.existsById(id)) {
            throw new AccountNotFoundException(id);
        }
        accountRepository.deleteById(id);
    }

    private AccountDto toDto(Account account) {
        return AccountDto.builder()
                .id(account.getId())
                .accountName(account.getAccountName())
                .accountType(account.getAccountType())
                .createdAt(account.getCreatedAt())
                .build();
    }

    private Account toEntity(AccountDto dto) {
        return Account.builder()
                .id(dto.getId())
                .accountName(dto.getAccountName())
                .accountType(dto.getAccountType())
                .createdAt(dto.getCreatedAt())
                .build();
    }
}
