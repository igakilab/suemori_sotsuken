package jp.igakilab.dwr.bomber;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

public class Command {
  SqlSessionFactory factory = DBUtility.getSqlSessionFactory();

  public List<Information> execute() {
    List<Information> InfoList = new ArrayList<>();

    try (SqlSession session = factory.openSession()) {
      InfoList = session.selectList("igakilab.mybatis.BomberMapper.selectcom");
      for (Information f : InfoList) {
        System.out.println(f.getUsername());
        System.out.println(f.getPointx());
        System.out.println(f.getPointy());
        System.out.println(f.getCom1());
        System.out.println(f.getCom2());
        System.out.println(f.getCom3());
        System.out.println(f.getCom4());
        System.out.println(f.getCom5());
      }
    }
    return InfoList;
  }

  /**
   * Infoクラスと同じデータ構造のオブジェクトをJSから受け取り，拡張for文で1つずつinsertする例
   *
   * @param InfoList
   */
  public void insertcom(ArrayList<Information> InfoList) {
    try (SqlSession session = factory.openSession()) {
      for (Information f : InfoList) {
        int ret = session.insert("igakilab.mybatis.BomberMapper.insertcom", f);// 1つずつinsert
        System.out.println("Return:" + ret);
        System.out.println(f.getUsername());
        System.out.println(f.getPointx());
        System.out.println(f.getPointy());
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
    Command pp = new Command();
    pp.execute();
  }

}
