package org.infpls.noxio.auth.module.testOne;

import java.util.*;
import org.springframework.stereotype.Component;

@Component
public class TestOneDao {
  
	private static List<TestMessageOne> messages;
  {
		messages = new ArrayList();
		messages.add(new TestMessageOne(0, "#1 Robbie Rotten Fan", "Who were you expecting? Sportaflop?"));
    messages.add(new TestMessageOne(0, "Not Sportaflop", "I want Robbie to fill me with his rotteness ;)"));
	}
  
  private int mid = 2;
  
  public List getMessages() {
      return messages;
  }
  
  public void putMessage(final TestMessageOne m) {
    messages.add(new TestMessageOne(mid++,m.getAuthor(),m.getMessage()));
  }
  
  public void deleteMessage(final TestMessageOne m) throws MessageException {
    for(int i=0;i<messages.size();i++) {
      if(messages.get(i).getId()==m.getId()) {
        messages.remove(i);
      }
    }
    throw new MessageException("Cannot delete message as it no longer exists.");
  }
  
}
