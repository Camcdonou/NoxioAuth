package org.infpls.noxio.auth.module.auth.session.online;

import org.infpls.noxio.auth.module.auth.dao.pay.PaymentDao;
import org.infpls.noxio.auth.module.auth.session.Packet;

public class PacketO20 extends Packet {
  private final PaymentDao.Item item;
  public PacketO20(final PaymentDao.Item item) {
    super("o20");
    this.item = item;
  }
  
  public PaymentDao.Item getItem() { return item; }
}
