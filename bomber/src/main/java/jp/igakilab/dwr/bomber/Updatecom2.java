package jp.igakilab.dwr.bomber;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

public class Updatecom2 {
  public void execute(String[] log) {
    Command2 com = new Command2();

    com.setCom6(log[0]);
    com.setCom7(log[1]);
    com.setCom8(log[2]);
    com.setCom9(log[3]);
    com.setCom10(log[4]);

    SqlSessionFactory factory = DBUtility.getSqlSessionFactory();
    try (SqlSession session = factory.openSession()) {

      session.update("igakilab.mybatis.BomberMapper.updateCommand2", com);
      session.commit();

    }

  }

  public static void main(String[] args) {
    Updatecom2 cu = new Updatecom2();
    String[] log = { "up", "down", "right", "left", "bom" };
    cu.execute(log);
  }
}
