package com.example.fullstackapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseFileDto {

    private Long id;
    private String fileName;
    private String fileType;
    private String filePath;
    private String userName;
    private String accountName;
    private LocalDateTime uploadedAt;
}
