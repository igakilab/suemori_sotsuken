package jp.igakilab.dwr.bomber;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

public class User2com {
  SqlSessionFactory factory = DBUtility.getSqlSessionFactory();

  public List<Command1> execute() {
    List<Command1> Command1List = new ArrayList<>();

    try (SqlSession session = factory.openSession()) {
      Command1List = session.selectList("igakilab.mybatis.BomberMapper.selectcom1");
      for (Command1 f : Command1List) {
        System.out.println(f.getCom1());
        System.out.println(f.getCom2());
        System.out.println(f.getCom3());
        System.out.println(f.getCom4());
        System.out.println(f.getCom5());
      }
    }
    return Command1List;
  }

  /**
   * Infoクラスと同じデータ構造のオブジェクトをJSから受け取り，拡張for文で1つずつinsertする例
   *
   * @param InfoList
   */
  public void insertcom2(ArrayList<Command2> Command2List) {
    try (SqlSession session = factory.openSession()) {
      for (Command2 f : Command2List) {
        int ret = session.insert("igakilab.mybatis.BomberMapper.insertcom2", f);// 1つずつinsert
        System.out.println("Return:" + ret);
        System.out.println(f.getCom6());
        System.out.println(f.getCom7());
        System.out.println(f.getCom8());
        System.out.println(f.getCom9());
        System.out.println(f.getCom10());
      }
      session.commit();// これを呼び出すと書き込まれる
    }
  }

  public static void main(String[] args) {
    User2com pp = new User2com();
    pp.execute();
  }

}
