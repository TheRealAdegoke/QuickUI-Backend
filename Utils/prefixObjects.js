const prefixForPrompts = {
  promptPrefixLogo: "In just one word describe a good company name for",
  promptPrefixForHeroHeader:
    "Write a short header not less than 3 words and not more than 4 words without any special characters it must be 4 words for a hero section for",
  promptPrefixForHeroDescription:
    "Write a short description not less than 25 words and not more than 30 words without any special characters for a website",
  promptPrefixForFaqQuestion:
    "Ask a short Question not less than 3 words and not more than 4 words without any special characters it must be 4 words for a FAQ section in a website for",
  promptPrefixForFAQAnswer: `Without any special characters give a short answer to the question asked in`,
};

const randomButtonText = [
  "Explore",
  "Shop Now",
  "Learn More",
  "Get Started",
  "Subscribe",
  "Contact Us",
  "View Demo",
  "Browse Products",
  "Join Us",
  "Discover More",
  "Read More",
  "Get in Touch",
  "Try Now",
  "Download Now",
  "Start Trial",
  "Learn More",
  "Get Involved",
  "Join the Community",
  "Become a Member",
  "Find Out More",
  "Watch Video",
  "Explore Now",
  "Get Help",
  "Find Solutions",
  "Join Newsletter",
  "Book Now",
  "Take Action",
  "Visit Us",
  "Pricing",
  "Features"
];

const FAQsHeader = [
  "FAQs",
  "Frequently Asked Questions",
  "Help & Support",
  "Need Assistance?",
  "Your Questions Answered",
  "Quick Help",
  "Got Questions?",
  "Information & Assistance",
  "Common Questions",
];

const teamHeader = [
  "OUR Team",
  "Team Profiles",
  "Our Experts",
  "Meet the Team",
  "Team Members",
  "Meet Our Experts",
  "Our Professionals",
  "Our Dedicated Team",
];

const featureHeader = [
  "Feature Showcase",
  "Feature Overview",
  "Product Highlights",
  "Notable Features",
  "Key Attributes",
  "Feature Set",
  "What We Offer",
  "Key Features",
  "Product Features",
  "Core Features",
];

const contactHeader = [
  "Contact Us",
  "Get in Touch",
  "Reach Out",
  "Connect With Us",
  "Contact Information",
  "Let's Talk",
  "Reach Us Anytime",
  "Talk to Us",
  "Connect Today",
];

const customerHeader = [
  "Customer Review",
  "Client Testimonials",
  "Feedback from Customers",
  "Customer Testimonials",
  "Client Reviews",
  "What Our Customers Say",
  "Customer Feedback",
  "Client Experiences",
  "Feedback from Clients",
  "Reviews by Customers",
  "Hear from Our Customers",
];

const statsHeader = [
  "Achievement Rates",
  "Our Track Record",
  "Success Metrics",
  "Performance Rates",
  "Our Achievements",
  "Track Record of Success",
  "Our Performance",
  "Success Statistics",
  "Our Results",
  "Success Overview",
  "Rate of Success",
  "Our Accomplishments",
  "Success Figures",
  "Our Effectiveness",
  "Achievement Statistics",
];

const partnerHeader = [
  "Our Trusted Partners",
  "Valued Partners",
  "Our Key Partners",
  "Trusted Collaborators",
  "Esteemed Partners",
  "Partnered with Excellence",
  "Collaborative Partners",
  "Our Business Partners",
  "Our Supportive Partners",
  "Our Partner Ecosystem",
  "Our Collaborators",
];

const customerParagraphText = [
  "See what your customers love about us.",
  "Discover why our customers choose us.",
  "Hear what our clients appreciate most.",
  "Find out what makes our customers happy.",
  "See why customers rave about us.",
  "Learn what our clients love about our services.",
  "Explore our customer favorites.",
  "Uncover why our clients stay loyal.",
  "See the top reasons customers love us.",
  "Find out what our customers are saying.",
  "Learn why customers trust us.",
];

const customerReviewText = [
  "QuickUI is incredibly cool. The builder is easy to use and gets you beautiful results. The team is also pretty cool. I might be a bit biased so take a look for yourself!",
  "QuickUI is simply amazing. The intuitive builder makes it easy to create stunning results. Plus, the team behind it is fantastic. Don't just take my word for it—check it out yourself!",
  "With QuickUI, creating beautiful designs is a breeze. The user-friendly builder and the awesome team make it a standout choice. But don't just rely on my opinion, explore it yourself!",
  "QuickUI offers an incredibly user-friendly builder that delivers gorgeous results. The team is great, too. See for yourself and experience the ease of use!",
  "QuickUI: where cool meets functionality. Our intuitive builder crafts stunning designs with ease. Plus, our team? They're rockstars. But hey, don't just take our word for it. Try it out and see!",
  "Discover the magic of QuickUI! Our simple yet powerful builder creates gorgeous designs in no time. Oh, and did we mention our team is pretty amazing too? But hey, don't just take our word for it—explore and decide for yourself!",
  "Unleash your creativity with QuickUI! Our builder makes crafting beautiful designs a breeze. And guess what? Our team is pretty awesome too. But don't just take our word for it—experience it firsthand!",
  "Elevate your designs with QuickUI! Our builder simplifies the process and delivers stunning outcomes. Plus, our team is pretty awesome. But hey, don't just take our word for it—see it in action!",
  "Join the QuickUI revolution! Our intuitive builder helps you craft stunning designs effortlessly. And our team? Well, they're the best. But hey, don't take our word for it—experience it firsthand!",
  "Experience the ease and beauty of QuickUI! Our builder makes design a breeze, and our team is pretty cool too. But hey, why listen to us? See it in action and judge for yourself!",
  "Experience the awesomeness of QuickUI! Our user-friendly builder delivers stunning results effortlessly. And hey, we think our team is pretty awesome too. But don't just take our word for it—see for yourself!",
];

const teamParagraphText = [
  "Get to know an amazing group of People on a mission to make a difference.",
  "Meet a passionate team dedicated to creating positive change.",
  "Discover the inspiring individuals committed to making a difference.",
  "Get acquainted with our dedicated team on a mission to impact the world.",
  "Learn about the remarkable people striving to make a meaningful difference.",
  "Meet the driven team working tirelessly to bring about change.",
  "Discover the amazing group of individuals focused on making a positive impact.",
  "Get to know the committed team behind our mission to improve lives.",
  "Meet the extraordinary people working to make a real difference.",
  "Learn about the passionate team dedicated to driving change.",
  "Discover the incredible individuals on a mission to transform the world.",
];

const faqParagraphText = [
  "Frequently asked questions answered",
  "Get answers to the most commonly asked questions.",
  "Find responses to frequently asked queries.",
  "Your most frequent questions, answered here.",
  "Discover answers to the questions we hear the most.",
  "Common questions and their answers.",
  "See the answers to the questions we get asked the most.",
  "Get solutions to the most frequent inquiries.",
  "Frequently asked questions and their detailed answers.",
  "Your top questions, answered for your convenience.",
  "Explore answers to popular questions from our customers.",
];


module.exports = {
  prefixForPrompts,
  randomButtonText,
  FAQsHeader,
  teamHeader,
  featureHeader,
  contactHeader,
  customerHeader,
  statsHeader,
  partnerHeader,
  customerParagraphText,
  teamParagraphText,
  faqParagraphText,
  customerReviewText,
};