package com.cms.IT_DEC.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class IT_FileEntry_Mapping {
    @Id
    private long id;
    private String fileEntryId;
    private String isFSubmitInfoId;
    private Long itDecId;
}
