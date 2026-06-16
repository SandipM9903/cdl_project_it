package com.cms.IT_DEC.controller;


import com.cms.IT_DEC.dto.IT_Declaration_MasterDTO;
import com.cms.IT_DEC.service.IT_Declaration_Master_Service;
import com.cms.IT_DEC.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin
@RequestMapping("/it-declaration-master")
public class IT_Declaration_Master_Controller {

    @Autowired
    private IT_Declaration_Master_Service itDeclarationMasterService;

    @GetMapping("/get-all")
    public ResponseEntity<ResponseUtil<List<IT_Declaration_MasterDTO>>> getAllMaster() {
        List<IT_Declaration_MasterDTO> itDeclarationMasterDTOList = itDeclarationMasterService.getAllMaster();
        ResponseUtil<List<IT_Declaration_MasterDTO>> response = ResponseUtil.<List<IT_Declaration_MasterDTO>>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("Declarations fetched successfully")
                .data(itDeclarationMasterDTOList)
                .build();

        return ResponseEntity.ok(response);
    }
}
