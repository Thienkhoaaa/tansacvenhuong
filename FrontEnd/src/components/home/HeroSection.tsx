import artisanPhoto from '../../assets/tuy-loan-home.png';

export const HeroSection = () => (
  <section id="home" className="village-hero" aria-labelledby="home-title">
    <img className="village-hero__photo" src={artisanPhoto} alt="Người phụ nữ tráng bánh thủ công bên bếp lửa tại làng nghề Túy Loan" fetchPriority="high" />
    <div className="village-hero__shade" />
    <div className="village-hero__content">
      <h1 id="home-title">TÚY LOAN</h1>
      <p className="village-hero__tagline">Giữ lửa Túy Loan – Giữ hồn xứ Quảng</p>
      <p className="village-hero__description">
        Bên bếp lửa ấm, đôi bàn tay cần mẫn vẫn ngày ngày gìn giữ nghề làm bánh tráng Túy Loan.
        Từ hạt gạo mộc mạc đến chiếc bánh thơm giòn là câu chuyện của con người, của ký ức
        và tình yêu dành cho quê hương. Cùng khám phá những câu chuyện bình dị để cảm nhận
        hồn xứ Quảng trong từng nếp nghề truyền thống.
      </p>
      {/* <div className="village-hero__actions">
        <button type="button" disabled title="Câu chuyện đang được cập nhật">CÂU CHUYỆN</button>
        <button type="button" disabled title="Cửa hàng đang được cập nhật">CỬA HÀNG</button>
      </div> */}
    </div>
  </section>
);
