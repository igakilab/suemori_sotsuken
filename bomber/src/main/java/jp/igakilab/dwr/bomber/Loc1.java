package jp.igakilab.dwr.bomber;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

public class Loc1 {
  SqlSessionFactory factory = DBUtility.getSqlSessionFactory();

  public List<Loc2info> execute() {
    List<Loc2info> Loc2List = new ArrayList<>();

    try (SqlSession session = factory.openSession()) {
      Loc2List = session.selectList("igakilab.mybatis.BomberMapper.selectloc2");
      for (Loc2info f : Loc2List) {
        System.out.println(f.getPoint2x());
        System.out.println(f.getPoint2y());
      }
    }
    return Loc2List;
  }

  /**
   * Infoクラスと同じデータ構造のオブジェクトをJSから受け取り，拡張for文で1つずつinsertする例
   *
   * @param InfoList
   */
  public void insertLoc1(ArrayList<Loc1info> Loc1List) {
    try (SqlSession session = factory.openSession()) {
      for (Loc1info f : Loc1List) {
        int ret = session.insert("igakilab.mybatis.BomberMapper.insertloc1", f);// 1つずつinsert
        System.out.println("Return:" + ret);
        System.out.println(f.getPoint1x());
        System.out.println(f.getPoint1y());
      }
      session.commit();// これを呼び出すと書き込まれる
    }
  }

  public static void main(String[] args) {
    Loc1 pp = new Loc1();
    pp.execute();
  }

}
