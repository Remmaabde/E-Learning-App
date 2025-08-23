

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "Our Menu", href: "#menu" },
  { name: "Contact Us", href: "#contact" },
  { name: "Our Story", href: "#story" },
  { name: "FeedBack Form", href: "#feedback" },
];

const connectLinks = [
  { name: "Facebook Page", href: "#facebook" },
  { name: "Instagram Feed", href: "#instagram" },
  { name: "Twitter Profile", href: "#twitter" },
  { name: "LinkedIn Page", href: "#linkedin" },
  { name: "YouTube Channel", href: "#youtube" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "#facebook",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline-block mr-2"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12z" fill="#fff"/></svg>
    ),
  },
  {
    name: "Instagram",
    href: "#instagram",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline-block mr-2"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25 1.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill="#fff"/></svg>
    ),
  },
  {
    name: "Twitter",
    href: "#twitter",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline-block mr-2"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 22.46 6z" fill="#fff"/></svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#linkedin",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline-block mr-2"><path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zm-9 19H5v-9h5v9zm-2.5-10.25c-1.24 0-2.25-1.01-2.25-2.25S6.26 4.25 7.5 4.25 9.75 5.26 9.75 6.5 8.74 8.75 7.5 8.75zm14.5 10.25h-5v-4.5c0-1.1-.9-2-2-2s-2 .9-2 2v4.5h-5v-9h5v1.25c.69-1.16 2.01-1.25 2.5-1.25 2.21 0 4 1.79 4 4v5z" fill="#fff"/></svg>
    ),
  },
  {
    name: "YouTube",
    href: "#youtube",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline-block mr-2"><path d="M23.498 6.186a2.997 2.997 0 0 0-2.112-2.12C19.19 3.5 12 3.5 12 3.5s-7.19 0-9.386.566a2.997 2.997 0 0 0-2.112 2.12C0 8.384 0 12 0 12s0 3.616.502 5.814a2.997 2.997 0 0 0 2.112 2.12C4.81 20.5 12 20.5 12 20.5s7.19 0 9.386-.566a2.997 2.997 0 0 0 2.112-2.12C24 15.616 24 12 24 12s0-3.616-.502-5.814zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" fill="#fff"/></svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#310055] pt-12 pb-4 px-6 md:px-16 lg:px-32">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
        
        <div className="flex flex-col items-start">
           <img src="/Images/logo.png" alt="Logo" className="h-20" />
        </div>
    
        <div>
          <h3 className="font-roboto font-semibold text-[16px] leading-[150%] mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map(link => (
              <li key={link.name}>
                <a href={link.href} className="font-roboto font-normal text-[14px] leading-[150%] tracking-[0] text-white hover:underline">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
    
        <div>
          <h3 className="font-roboto font-semibold text-[16px] leading-[150%] mb-4">Connect With Us</h3>
          <ul className="space-y-2">
            {connectLinks.map(link => (
              <li key={link.name}>
                <a href={link.href} className="font-roboto font-normal text-[14px] leading-[150%] tracking-[0] text-white hover:underline">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-roboto font-semibold text-[16px] leading-[150%] mb-4">Stay Updated</h3>
          <ul className="space-y-2">
            {socialLinks.map(link => (
              <li key={link.name}>
                <a href={link.href} className="flex items-center font-roboto font-normal text-[14px] leading-[150%] tracking-[0] text-white hover:underline">
                  {link.icon}
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <hr className="border-t border-black my-6" />
      <div className="flex flex-col md:flex-row justify-between items-center text-white text-[14px] font-roboto font-normal leading-[150%] tracking-[0]">
        <span className="mb-2 md:mb-0">&copy; 2025 DirecEd. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#privacy" className="underline">Privacy Policy</a>
          <a href="#terms" className="underline">Terms of Service</a>
          <a href="#cookie" className="underline">Cookie Setting</a>
        </div>
      </div>
    </footer>
  );
}
