package com.cms.IT_DEC.repository;

import com.cms.IT_DEC.model.IT_FileEntry_Mapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IT_FileEntry_Mapping_Repo extends JpaRepository<IT_FileEntry_Mapping,Long> {
    List<IT_FileEntry_Mapping> findByItDecIdAndIsFSubmitInfoId(Long itDecId, String isFSubmitInfoId);
}