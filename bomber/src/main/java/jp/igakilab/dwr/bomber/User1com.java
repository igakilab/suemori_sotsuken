package jp.igakilab.dwr.bomber;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

public class User1com {
  SqlSessionFactory factory = DBUtility.getSqlSessionFactory();

  public List<Command2> execute() {
    List<Command2> Command2List = new ArrayList<>();

    try (SqlSession session = factory.openSession()) {
      Command2List = session.selectList("igakilab.mybatis.BomberMapper.selectcom2");
      for (Command2 f : Command2List) {
        System.out.println(f.getCom6());
        System.out.println(f.getCom7());
        System.out.println(f.getCom8());
        System.out.println(f.getCom9());
        System.out.println(f.getCom10());
      }
    }
    return Command2List;
  }

  /**
   * Infoクラスと同じデータ構造のオブジェクトをJSから受け取り，拡張for文で1つずつinsertする例
   *
   * @param InfoList
   */
  public void insertcom1(ArrayList<Command1> Command1List) {
    try (SqlSession session = factory.openSession()) {
      for (Command1 f : Command1List) {
        int ret = session.insert("igakilab.mybatis.BomberMapper.insertcom1", f);// 1つずつinsert
        System.out.println("Return:" + ret);
        System.out.println(f.getCom1());
        System.out.println(f.getCom2());
        System.out.println(f.getCom3());
        System.out.println(f.getCom4());
        System.out.println(f.getCom5());
      }
      session.commit();// これを呼び出すと書き込まれる
    }
  }

  public static void main(String[] args) {
    User1com pp = new User1com();
    pp.execute();
  }

}
