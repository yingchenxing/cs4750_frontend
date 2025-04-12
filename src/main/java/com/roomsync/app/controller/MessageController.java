package com.roomsync.app.controller;

import com.roomsync.app.model.Message;
import com.roomsync.app.service.MessageService;
import com.roomsync.app.controller.request.SendMessageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody SendMessageRequest request) {
        Message message = messageService.sendMessage(request.getSender(), request.getReceiver(), request.getContent());
        return ResponseEntity.ok(message);
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(@RequestParam Long user1, @RequestParam Long user2) {
        return ResponseEntity.ok(messageService.getConversation(user1, user2));
    }
}
