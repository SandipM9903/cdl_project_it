package com.cms.IT_DEC.repository;

import com.cms.IT_DEC.model.IT_Declaration_Master;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IT_Declaration_Master_Repo extends JpaRepository<IT_Declaration_Master,Long> {
}
