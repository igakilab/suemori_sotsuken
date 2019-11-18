package jp.igakilab.dwr.bomber;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

public class Loc2 {
  SqlSessionFactory factory = DBUtility.getSqlSessionFactory();

  public List<Loc1info> execute() {
    List<Loc1info> Loc1List = new ArrayList<>();

    try (SqlSession session = factory.openSession()) {
      Loc1List = session.selectList("igakilab.mybatis.BomberMapper.selectloc1");
      for (Loc1info f : Loc1List) {
        System.out.println(f.getPoint1x());
        System.out.println(f.getPoint1y());
      }
    }
    return Loc1List;
  }

  /**
   * Infoクラスと同じデータ構造のオブジェクトをJSから受け取り，拡張for文で1つずつinsertする例
   *
   * @param InfoList
   */
  public void insertLoc2(ArrayList<Loc2info> Loc2List) {
    try (SqlSession session = factory.openSession()) {
      for (Loc2info f : Loc2List) {
        int ret = session.insert("igakilab.mybatis.BomberMapper.insertloc2", f);// 1つずつinsert
        System.out.println("Return:" + ret);
        System.out.println(f.getPoint2x());
        System.out.println(f.getPoint2y());
      }
      session.commit();// これを呼び出すと書き込まれる
    }
  }

  public static void main(String[] args) {
    Loc2 pp = new Loc2();
    pp.execute();
  }

}
