package com.workshopai.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WorksheetRequest {
    
    @NotBlank
    private String title;
    
    private String description;
    
    @NotBlank
    private String youtubeUrl;
    
    @NotBlank
    private String questionType;
    
    @NotNull
    private Integer numberOfQuestions;
    
    @NotBlank
    private String difficultyLevel;
    
    @NotBlank
    private String outputFormat;
    
    private String additionalInstructions;
    
    private String worksheetContent;
    
    private String answerKey;
}
