package com.example.fullstackapp.service;

import com.example.fullstackapp.dto.ExpenseFileDto;
import com.example.fullstackapp.entity.Account;
import com.example.fullstackapp.entity.ExpenseFile;
import com.example.fullstackapp.entity.User;
import com.example.fullstackapp.exception.AccountNotFoundException;
import com.example.fullstackapp.exception.ExpenseFileNotFoundException;
import com.example.fullstackapp.exception.FileNotOnDiskException;
import com.example.fullstackapp.exception.UserNotFoundException;
import com.example.fullstackapp.repository.AccountRepository;
import com.example.fullstackapp.repository.ExpenseFileRepository;
import com.example.fullstackapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ExpenseFileServiceImpl implements ExpenseFileService {

    private static final DateTimeFormatter TIMESTAMP_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final ExpenseFileRepository expenseFileRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    @Value("${app.upload-dir:/app/uploads}")
    private String uploadDir;

    @Override
    public ExpenseFileDto upload(MultipartFile file, Long userId, Long accountId) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("File name is required");
        }
        String ext = getFileExtension(originalFilename).toLowerCase();
        if (!"csv".equals(ext) && !"xlsx".equals(ext)) {
            throw new IllegalArgumentException("Only .csv and .xlsx files are allowed");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new AccountNotFoundException(accountId));

        String userName = sanitizeForFileName(user.getName());
        String accountName = sanitizeForFileName(account.getAccountName());
        String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMAT);
        String storedFileName = userName + "_" + accountName + "_" + timestamp + "." + ext;

        try {
            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);
            Path targetPath = dir.resolve(storedFileName);
            file.transferTo(targetPath.toFile());
            String filePath = targetPath.toString();

            ExpenseFile entity = ExpenseFile.builder()
                    .fileName(storedFileName)
                    .fileType(ext)
                    .filePath(filePath)
                    .userId(userId)
                    .accountId(accountId)
                    .uploadedAt(LocalDateTime.now())
                    .build();
            ExpenseFile saved = expenseFileRepository.save(entity);
            return toDto(saved);
        } catch (IOException e) {
            log.error("Failed to save file: {}", originalFilename, e);
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseFileDto> getAllExpenseFiles() {
        return expenseFileRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public void deleteById(Long id) {
        ExpenseFile entity = expenseFileRepository.findById(id).orElseThrow(() -> new ExpenseFileNotFoundException(id));
        Path path = Paths.get(entity.getFilePath());
        try {
            if (Files.exists(path)) {
                Files.delete(path);
            }
        } catch (IOException e) {
            log.warn("Could not delete physical file: {}", entity.getFilePath(), e);
        }
        expenseFileRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public FileDownloadResult getFileForDownload(Long id) {
        ExpenseFile entity = expenseFileRepository.findById(id).orElseThrow(() -> new ExpenseFileNotFoundException(id));
        Path path = Paths.get(entity.getFilePath());
        if (!Files.exists(path) || !Files.isReadable(path)) {
            throw new FileNotOnDiskException(id);
        }
        Resource resource = new FileSystemResource(path.toFile());
        return new FileDownloadResult(entity.getFileName(), resource);
    }

    private static String getFileExtension(String filename) {
        int i = filename.lastIndexOf('.');
        return i > 0 ? filename.substring(i + 1) : "";
    }

    private static String sanitizeForFileName(String value) {
        if (value == null) return "unknown";
        return value.trim()
                .replaceAll("\\s+", "_")
                .replaceAll("[^a-zA-Z0-9_-]", "");
    }

    private ExpenseFileDto toDto(ExpenseFile entity) {
        String userName = userRepository.findById(entity.getUserId())
                .map(User::getName)
                .orElse("?");
        String accountName = accountRepository.findById(entity.getAccountId())
                .map(Account::getAccountName)
                .orElse("?");
        return ExpenseFileDto.builder()
                .id(entity.getId())
                .fileName(entity.getFileName())
                .fileType(entity.getFileType())
                .filePath(entity.getFilePath())
                .userName(userName)
                .accountName(accountName)
                .uploadedAt(entity.getUploadedAt())
                .build();
    }
}
