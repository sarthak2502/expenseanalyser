package com.example.fullstackapp.controller;

import com.example.fullstackapp.dto.ExpenseFileDto;
import com.example.fullstackapp.service.ExpenseFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/expense-files")
@RequiredArgsConstructor
public class ExpenseFileController {

    private final ExpenseFileService expenseFileService;

    @PostMapping("/upload")
    public ResponseEntity<ExpenseFileDto> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId,
            @RequestParam("accountId") Long accountId) {
        ExpenseFileDto dto = expenseFileService.upload(file, userId, accountId);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseFileDto>> getAllExpenseFiles() {
        return ResponseEntity.ok(expenseFileService.getAllExpenseFiles());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        ExpenseFileService.FileDownloadResult result = expenseFileService.getFileForDownload(id);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + result.fileName() + "\"");
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(result.resource());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpenseFile(@PathVariable Long id) {
        expenseFileService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
