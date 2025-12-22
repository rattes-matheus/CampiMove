package com.campimove.backend.repositories;

import com.campimove.backend.entities.HorarioOnibus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface HorarioOnibusRepository extends JpaRepository<HorarioOnibus, Long> {
    
    List<HorarioOnibus> findByOrigemAndAtivoTrueOrderByHorario(String origem);
    List<HorarioOnibus> findByAtivoTrueOrderByOrigemAscHorarioAsc();
    
    @Query("SELECT h FROM HorarioOnibus h WHERE h.origem = :origem AND h.horario >= :horarioAtual AND h.ativo = true ORDER BY h.horario ASC")
    List<HorarioOnibus> findProximosHorarios(String origem, LocalTime horarioAtual);

    List<HorarioOnibus> findByAtivo(Boolean ativo);

}