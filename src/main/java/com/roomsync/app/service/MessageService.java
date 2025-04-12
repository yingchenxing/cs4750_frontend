package com.roomsync.app.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.roomsync.app.model.Message;
import com.roomsync.app.model.User;
import com.roomsync.app.repository.MessageRepository;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message sendMessage(User sender, User receiver, String content) {
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }

    public List<Message> getConversation(Long userId1, Long userId2) {
        return messageRepository.findAll().stream()
            .filter(m -> (m.getSender().getUserId().equals(userId1) && m.getReceiver().getUserId().equals(userId2)) ||
                         (m.getSender().getUserId().equals(userId2) && m.getReceiver().getUserId().equals(userId1)))
            .sorted(Comparator.comparing(Message::getTimestamp))
            .collect(Collectors.toList());
    }
}
