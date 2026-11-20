

export const Footer = () => (
  <footer className="village-footer">
    <div className="village-footer__inner">
      <div className="village-footer__identity">
        <a href="#home" aria-label="LOICHOI — về đầu trang">
          <span className="loichoi-mark" role="img" aria-label="LOICHOI — EST 2026" />
        </a>
        <p>Giữ lửa Túy Loan – Giữ hồn xứ Quảng</p>
      </div>
      <div className="village-footer__story">
        <span>LÀNG NGHỀ TÚY LOAN</span>
        <p>Từ bếp lửa và những đôi bàn tay cần mẫn, câu chuyện bánh tráng Túy Loan tiếp tục được kể qua từng nếp nghề.</p>
      </div>
      <a className="village-footer__top" href="#home">VỀ ĐẦU TRANG <span aria-hidden="true">↑</span></a>
    </div>
    <div className="village-footer__bottom">© {new Date().getFullYear()} LOICHOI · Túy Loan</div>
  </footer>
);
