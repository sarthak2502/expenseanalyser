package com.example.fullstackapp.repository;

import com.example.fullstackapp.entity.ExpenseFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseFileRepository extends JpaRepository<ExpenseFile, Long> {
}
