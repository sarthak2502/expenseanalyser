package com.example.fullstackapp.exception;

public class FileNotOnDiskException extends RuntimeException {

    public FileNotOnDiskException(Long id) {
        super("File no longer exists on server for record id: " + id);
    }
}
