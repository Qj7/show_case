import type { Dictionary } from "./ru";

export const vi: Dictionary = {
  meta: {
    title: "Orbita — phát triển website, ứng dụng di động và máy tính",
    description:
      "Đội ngũ phát triển trọn gói: website, dịch vụ web, ứng dụng di động và máy tính, Telegram Mini App. Từ ý tưởng, thiết kế đến ra mắt và hỗ trợ.",
  },
  common: {
    skipToContent: "Chuyển đến nội dung",
    logoHome: "{name} — trang chủ",
  },
  nav: {
    work: "Dự án",
    services: "Dịch vụ",
    process: "Quy trình",
    contact: "Liên hệ",
  },
  header: {
    mainNav: "Điều hướng chính",
    mobileNav: "Điều hướng di động",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    language: "Ngôn ngữ",
  },
  hero: {
    title: "Chúng tôi xây dựng website, ứng dụng và\u00a0dịch vụ trọn\u00a0gói",
    lead: "Đội ngũ nhà thiết kế và lập trình viên. Chúng tôi làm sản phẩm web, di động và máy tính: từ ý tưởng, nguyên mẫu đến phát hành và hỗ trợ.",
    cta: "Thảo luận dự án",
    secondary: "Xem dự án",
    platforms: {
      web: "Website và dịch vụ",
      mobile: "Ứng dụng di động",
      desktop: "Ứng dụng máy tính",
      bots: "Mini App và bot",
    },
    stats: {
      years: "{n}+ năm",
      yearsLabel: "kinh nghiệm phát triển",
      platformsLabel: "nền tảng",
      turnkey: "Trọn gói",
      turnkeyLabel: "từ ý tưởng đến phát hành",
    },
  },
  marquee: {
    label: "Công nghệ",
  },
  categories: {
    web: "Web",
    mobile: "Di động",
    desktop: "Máy tính",
    bots: "Telegram",
  },
  works: {
    eyebrow: "Dự án tiêu biểu",
    title: "Những dự án ",
    titleAccent: "đang hoạt động",
    text: "Website, dịch vụ và ứng dụng cho doanh nghiệp: từ landing page trong một tuần đến sản phẩm có tài khoản người dùng và tích hợp.",
    filterLegend: "Lọc theo loại dự án",
    all: "Tất cả",
    ai: "Làm cùng AI",
  },
  services: {
    eyebrow: "Chúng tôi làm gì",
    title: "Mọi sản phẩm số, ",
    titleAccent: "một đội ngũ",
    text: "Không cần tìm riêng nhà thiết kế, lập trình viên frontend, mobile và DevOps. Chúng tôi xây dựng toàn bộ sản phẩm và chịu trách nhiệm về kết quả.",
    items: {
      web: {
        title: "Phát triển web",
        text: "Website, landing page, cửa hàng trực tuyến và dịch vụ web phức tạp. Nhanh, responsive và sẵn sàng cho SEO.",
        points: ["Next.js · React", "Thương mại điện tử", "Tài khoản người dùng", "CMS và trang quản trị"],
      },
      mobile: {
        title: "Ứng dụng di động",
        text: "Ứng dụng đa nền tảng cho iOS và Android với trải nghiệm như native.",
        points: ["React Native", "Expo", "Phát hành lên store"],
      },
      desktop: {
        title: "Máy tính",
        text: "Ứng dụng cho macOS, Windows và Linux từ một mã nguồn duy nhất.",
        points: ["Electron", "Tauri", "Tự động cập nhật"],
      },
      bots: {
        title: "Telegram Mini App và bot",
        text: "Cửa hàng, dịch vụ và tự động hóa ngay trong Telegram.",
        points: ["Mini App", "Bot Python", "Thanh toán"],
      },
      design: {
        title: "Thiết kế UI/UX",
        text: "Nguyên mẫu, hệ thống thiết kế và giao diện dễ hiểu ngay từ màn hình đầu tiên.",
        points: ["Figma", "Hệ thống thiết kế", "Nguyên mẫu"],
      },
      backend: {
        title: "Backend và hạ tầng",
        text: "API, tích hợp, cơ sở dữ liệu, máy chủ và CI/CD. Chúng tôi lo mọi thứ phía sau.",
        points: ["Ruby on Rails", "Python", "PostgreSQL", "Docker"],
      },
    },
  },
  ai: {
    eyebrow: "Phát triển tăng tốc bằng AI",
    title: "Con người thiết kế. ",
    titleAccent: "AI agent tăng tốc.",
    text: "Chúng tôi đưa AI agent vào mọi giai đoạn: nguyên mẫu, dựng giao diện, kiểm thử và refactor. AI không thay thế kỹ sư, mà là công cụ giúp ra mắt sản phẩm nhanh hơn và dành ngân sách cho những gì thực sự quan trọng.",
    points: [
      { value: "Vài ngày", label: "để có nguyên mẫu chạy được, thay vì vài tuần" },
      { value: "Review", label: "từng dòng code bởi lập trình viên giàu kinh nghiệm" },
      { value: "Nhiều hơn", label: "thời gian cho sản phẩm, thay vì việc lặp lại" },
    ],
  },
  process: {
    eyebrow: "Cách chúng tôi làm việc",
    title: "Minh bạch ở mọi bước",
    text: "Bạn luôn biết dự án đang tiến triển ra sao: demo hằng tuần, tiến độ rõ ràng, không có bất ngờ vào phút cuối.",
    steps: [
      { title: "Tìm hiểu", text: "Tìm hiểu bài toán và doanh nghiệp, thống nhất mục tiêu, thời hạn và ngân sách." },
      { title: "Thiết kế", text: "Dựng nguyên mẫu và giao diện. Bạn thấy sản phẩm trước khi viết code." },
      {
        title: "Phát triển",
        text: "Các vòng lặp ngắn với demo mỗi tuần. AI agent tăng tốc việc lặp lại, con người chịu trách nhiệm chất lượng.",
      },
      { title: "Ra mắt và phát triển", text: "Triển khai, phân tích, hỗ trợ và phát triển sản phẩm sau khi ra mắt." },
    ],
  },
  contact: {
    eyebrow: "Bạn có ý tưởng?",
    title: "Cùng tạo nên ",
    titleAccent: "điều tuyệt vời",
    text: "Hãy kể về bài toán của bạn: chúng tôi phản hồi trong ngày, đề xuất giải pháp và ước tính thời gian. Miễn phí và không ràng buộc.",
    telegram: "Nhắn tin qua Telegram",
  },
  footer: {
    nav: "Điều hướng chân trang",
    sections: "Mục",
    contact: "Liên hệ",
  },
  project: {
    back: "Tất cả dự án",
    aiBadge: "Làm cùng AI agent trong Cursor",
    aiShort: "AI-built",
    openSite: "Mở website",
    year: "Năm",
    type: "Loại",
    role: "Vai trò",
    client: "Khách hàng",
    stack: "Công nghệ",
    task: "Bài toán",
    solution: "Giải pháp",
    result: "Kết quả",
    next: "Dự án tiếp theo",
    screen: "{title} — màn hình {n}",
    cover: "{title} — ảnh bìa dự án",
  },
  notFound: {
    title: "Không tìm thấy trang",
    text: "Có thể trang đã được chuyển đi hoặc chưa từng tồn tại.",
    home: "Về trang chủ",
  },
};
