package com.example.fullstackapp.service;

import com.example.fullstackapp.dto.ExpenseFileDto;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ExpenseFileService {

    ExpenseFileDto upload(MultipartFile file, Long userId, Long accountId);

    List<ExpenseFileDto> getAllExpenseFiles();

    void deleteById(Long id);

    /**
     * Returns the file resource for download. Filename is the first element, resource the second.
     * @throws com.example.fullstackapp.exception.ExpenseFileNotFoundException if record not found
     * @throws com.example.fullstackapp.exception.FileNotOnDiskException if record exists but file is missing
     */
    FileDownloadResult getFileForDownload(Long id);

    record FileDownloadResult(String fileName, Resource resource) {}
}
