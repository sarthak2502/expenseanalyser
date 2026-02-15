package com.example.fullstackapp.service;

import com.example.fullstackapp.dto.ExpenseDto;
import com.example.fullstackapp.entity.Expense;
import com.example.fullstackapp.exception.ExpenseNotFoundException;
import com.example.fullstackapp.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Override
    public ExpenseDto createExpense(ExpenseDto expenseDto) {
        Expense expense = toEntity(expenseDto);
        expense.setId(null);
        Expense saved = expenseRepository.save(expense);
        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseDto> getAllExpenses() {
        return expenseRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseDto getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException(id));
        return toDto(expense);
    }

    @Override
    public ExpenseDto updateExpense(Long id, ExpenseDto expenseDto) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException(id));

        existing.setTitle(expenseDto.getTitle());
        existing.setAmount(expenseDto.getAmount());
        existing.setCategory(expenseDto.getCategory());
        existing.setExpenseDate(expenseDto.getExpenseDate());

        Expense updated = expenseRepository.save(existing);
        return toDto(updated);
    }

    @Override
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ExpenseNotFoundException(id);
        }
        expenseRepository.deleteById(id);
    }

    private ExpenseDto toDto(Expense expense) {
        return ExpenseDto.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .expenseDate(expense.getExpenseDate())
                .createdAt(expense.getCreatedAt())
                .build();
    }

    private Expense toEntity(ExpenseDto dto) {
        return Expense.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .amount(dto.getAmount())
                .category(dto.getCategory())
                .expenseDate(dto.getExpenseDate())
                .createdAt(dto.getCreatedAt())
                .build();
    }
}
