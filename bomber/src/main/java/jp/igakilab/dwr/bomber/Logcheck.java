package jp.igakilab.dwr.bomber;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

public class Logcheck {

  public String execute(String name, String passward) {
    List<Userinfo> userList = new ArrayList<>();
    Userinfo player = new Userinfo();
    String result = "reject";

    player.setName(name);
    player.setPassward(passward);
    SqlSessionFactory factory = DBUtility.getSqlSessionFactory();
    try (SqlSession session = factory.openSession()) {
      userList = session.selectList("igakilab.mybatis.BomberMapper.selectuser");
    }

    for (Userinfo u : userList) {
      if (name.equals(u.getName())) {
        if (passward.equals(u.getPassward())) {
          result = "OK";
          break;
        }
      }
    }

    return result;
  }

  public static void main(String[] args) {
    Logcheck uic = new Logcheck();
    uic.execute("sue", "sue1");
  }
}
