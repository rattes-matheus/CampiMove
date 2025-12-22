package com.campimove.backend.repositories;

import com.campimove.backend.entities.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
    List<ChatMessageEntity> findByRoomIdOrderByTimestampAsc(String roomId);
    @Query(value = "SELECT DISTINCT ON (room_id) room_id, sender_id, text, timestamp FROM chat_messages WHERE sender_id = :motoristId OR recipient_id = :motoristId ORDER BY room_id, timestamp DESC", nativeQuery = true)
    List<Object[]> findLastMessagesForMotorist(@Param("motoristId") String motoristId);
    List<ChatMessageEntity> findBySenderIdAndIsTripAcceptedTrueOrderByTimestampDesc(String senderId);

    @Query("SELECT DISTINCT e.roomId FROM ChatMessageEntity e WHERE e.senderId = :userId AND e.isTripAccepted = true")
    List<String> findAcceptedRoomIdsBySenderId(@Param("userId") String userId);

    @Query("SELECT e FROM ChatMessageEntity e WHERE e.roomId IN :roomIds AND e.tripProposal IS NOT NULL")
    List<ChatMessageEntity> findProposalMessagesByRoomIds(@Param("roomIds") List<String> roomIds);

    @Query("SELECT e FROM ChatMessageEntity e WHERE e.roomId IN :roomIds AND e.tripProposal IS NOT NULL AND e.isTripAccepted = true")
    List<ChatMessageEntity> findProposalMessagesByAcceptedRoomIds(@Param("roomIds") List<String> roomIds);

    @Query("SELECT DISTINCT e.roomId FROM ChatMessageEntity e WHERE e.recipientId = :userId AND e.isTripAccepted = true")
    List<String> findAcceptedRoomIdsByRecipientId(@Param("userId") String userId);
}