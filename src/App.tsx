import { useState, useEffect } from "react";
import {
  Phone,
  Clock,
  MapPin,
  Menu as MenuIcon,
  Image as GalleryIcon,
  PhoneCall,
  FileText,
  Globe,
  ExternalLink,
  Star,
} from "lucide-react";
import sanityClient, { urlFor } from "./Lib/sanityClient.js";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState<"pt" | "en">("pt");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState({
    history: false,
    menu: false,
    gallery: false,
    contact: false,
  });
  const [heroText, setHeroText] = useState("");
  const [heroImage, setHeroImage] = useState(null);
  const [storyImage, setStoryImage] = useState(null);
  const [menuImage, setMenuImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [openingHours, setOpeningHours] = useState([]);
  const [transportInfo, setTransportInfo] = useState([]);
  const [menuPdf, setMenuPdf] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ["history", "menu", "gallery", "contact"];
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top <= window.innerHeight * 0.75;
          setIsVisible((prev) => ({ ...prev, [section]: isVisible }));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hour + minutes / 60;

      if (day === 0) return false;
      return (
        (currentTime >= 12 && currentTime <= 15) ||
        (currentTime >= 19 && currentTime <= 22)
      );
    };

    setIsOpen(checkIfOpen());

    const interval = setInterval(() => {
      setIsOpen(checkIfOpen());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStoryImage = async () => {
      try {
        const query = `*[_type == "ourStoryImage"][0]{ image { asset->{ url } }, altText, caption }`;
        const data = await sanityClient.fetch(query);
        setStoryImage(data);
      } catch (error) {
        console.error("Error fetching story image:", error);
      }
    };

    fetchStoryImage();
  }, []);

  const content = {
    pt: {
      nav: {
        history: "História",
        menu: "Menu",
        gallery: "Galeria",
        contact: "Contacto",
        book: "Reservar",
      },
      hero: {
        subtitle: "Tradição em Carnes Grelhadas desde 1953",
        open: "O restaurante está aberto e pronto para o receber.",
        closed:
          "O restaurante estará fechado excepcionalmente de 10 a 16 de fevereiro",
      },
      nextService: {
        today: "hoje às",
        tomorrow: "amanhã às",
        monday: "segunda-feira às",
      },
      history: {
        title: "Nossa História",
        content:
          "Desde 1953, Carvoaria Jacto tem sido uma referência em Lisboa para os amantes de carne. Localizado no histórico bairro de Intendente & Anjos, nosso restaurante mantém viva a tradição da autêntica culinária portuguesa, especializando-se em carnes grelhadas da mais alta qualidade.",
      },
      menu: {
        title: "Menu",
        button: "Discover our Menu",
        description:
          "Clique para ver nosso menu completo com todos os pratos e preços",
      },
      gallery: {
        title: "Galeria",
      },
      reviews: {
        title: "Avaliações dos Clientes",
        testimonials: [
          {
            text: "Uma experiência culinária excecional! As carnes são grelhadas na perfeição e o serviço é impecável. Uma verdadeira joia da gastronomia portuguesa.",
            author: "M. Dubois",
          },
          {
            text: "O melhor restaurante de carnes grelhadas que já experimentei em Lisboa. O ambiente é autêntico e acolhedor. Recomendo vivamente a costela!",
            author: "P. Martin",
          },
          {
            text: "Um sítio obrigatório para os amantes de carne. A tradição portuguesa é respeitada e sublimada. O pessoal é atencioso e os preços são razoáveis.",
            author: "S. Laurent",
          },
        ],
      },
      contact: {
        title: "Contacto",
        hours: "Segunda a Sábado: 12h-15h e 19h-22h",
        closed: "Domingo: Fechado",
        address: "Morada",
        phone: "Telefone",
        publicTransport: "Transportes Públicos",
        metro: "Metro: Intendente (Linha Verde) - 5 min a pé",
        bus: "Autocarros: 708, 734, 736 - Paragem Intendente",
      },
      footer: {
        tradition: "Tradição em Carnes Grelhadas desde 1953",
        hours: "Horário",
        follow: "Siga-nos",
        about: "Sobre Nós",
        aboutText:
          "Carvoaria Jacto é um restaurante familiar que mantém viva a tradição da autêntica culinária portuguesa desde 1953.",
        links: "Links Úteis",
        rights: "Todos os direitos reservados",
      },
    },
    en: {
      nav: {
        history: "History",
        menu: "Menu",
        gallery: "Gallery",
        contact: "Contact",
        book: "Book",
      },
      hero: {
        subtitle: "Grilled Meat Tradition since 1953",
        open: "The restaurant is open and ready to welcome you.",
        closed:
          "The restaurant will be exceptionally closed from February 10th to 16th",
      },
      nextService: {
        today: "today at",
        tomorrow: "tomorrow at",
        monday: "Monday at",
      },
      history: {
        title: "Our History",
        content:
          "Established in 1953, Carvoaria Jacto has become a staple in Lisbon for meat enthusiasts. Nestled in the historic Intendente & Anjos neighborhood, our restaurant proudly upholds the tradition of authentic Portuguese cuisine, with a focus on premium grilled meats.",
      },
      menu: {
        title: "Menu",
        button: "Discover our Menu",
        description:
          "Click to see our complete menu with all dishes and prices",
      },
      gallery: {
        title: "Gallery",
      },
      reviews: {
        title: "Customer Reviews",
        testimonials: [
          {
            text: "An exceptional culinary experience! The meats are perfectly grilled and the service is impeccable. A true jewel of Portuguese gastronomy.",
            author: "M. Dubois",
          },
          {
            text: "The best grilled meat restaurant I've tried in Lisbon. The atmosphere is authentic and warm. I highly recommend the prime rib!",
            author: "P. Martin",
          },
          {
            text: "A must for meat lovers. Portuguese tradition is respected and sublimated. The staff are attentive and the prices are reasonable.",
            author: "S. Laurent",
          },
        ],
      },
      contact: {
        title: "Contact",
        hours: "Monday to Saturday: 12PM-3PM and 7PM-10PM",
        closed: "Sunday: Closed",
        address: "Address",
        phone: "Phone",
        publicTransport: "Public Transport",
        metro: "Metro: Intendente (Green Line) - 5 min walk",
        bus: "Bus: 708, 734, 736 - Intendente Stop",
      },
      footer: {
        tradition: "Grilled Meat Tradition since 1953",
        hours: "Opening Hours",
        follow: "Follow Us",
        about: "About Us",
        aboutText:
          "Carvoaria Jacto is a family restaurant keeping alive the tradition of authentic Portuguese cuisine since 1953.",
        links: "Useful Links",
        rights: "All rights reserved",
      },
    },
  };

  const images = {
    logo: "https://lh3.googleusercontent.com/pw/AP1GczOc-uqt0lmNnxsbr0O648AlWqhgYbVo78BtihbamhkmPYZO0QQhWZGKHeD2XlTnFa8tm4h4uQOnnEo0fHoRqOrIQgKGZ1GnjE2gvvC9crpakSn1RCb6eg7wKE3XiNonS506tbcZyM0mwQMeodq2sF-O=w508-h491-s-no-gm",
    hero: "https://lh3.googleusercontent.com/pw/AP1GczMiKrh0ZXY-LC4_MbeJMPSZ2J6HDdDdqpSwedxhg3N0jRy9vMIp1axH0VvmXBR8tX0XZLkr8DIMq81edrpjAk-NyfrYLnNIi56AFh-GUlEDbhJRHZzwTpq_R8KpWCN-HH1NDCHtxMI_ZzQOJoFVHf2Z=w2048-h1365-s-no-gm",
    history:
      "https://lh3.googleusercontent.com/pw/AP1GczOTwu2cikB0gaQj1j8GJDyhop85JMSnfAe0ADTg8PLr6EK4zJFEHHe5xJVNc8jn0XgjOTGh0daceknG9Rf4g8PzC49RgaViqH3khwYfyRMMoQ3eA0T0Dw3yweTRLRXDQmHLLdhODUCa24PiRV7mZr4U=w2048-h1365-s-no-gm",
    menu: "https://lh3.googleusercontent.com/pw/AP1GczNLKy3T3c_NfuKm_7sPTHnhVKT6tOa_AedjgC-39QidIkQ5jSUReXiRKXZI5GsqXx0oWIG9IXBFeMHiVU8E4zv333wdviYP52HzEejg6XZiqLi6hbh_rsqwEgZtuFLOku-8qc9U99769-G6WVXccROA=w1216-h1300-s-no-gm?authuser=0",
    gallery: [
      "https://lh3.googleusercontent.com/pw/AP1GczMgDO7tAfMDaXyBu9mEOBkZrg35vhvzjLZuqEi1VPYssl12taqYEU3DUk7uFW8H9U4V9nqEaxMmx3U4Eolol2gCR-wylJlPuypSQdlA61tpbKrrzlRKeNO7rNCjjlir1KvPBgB2Ia6-oYCpl9VF1RLp=w1107-h1661-s-no-gm",
      "https://lh3.googleusercontent.com/pw/AP1GczN7FHzQIoDw_FM9pIILqciFQNkQALkhGYG8IIvt1xWCEW6fu92c3KVbV-BgoXYxN5jXWqEB2Pgi4OV1D7dXT0mJ2AQOlZVG03oew3Eqr0KIkGSrjHfUxtIAP-ELGvh1CEt35eWmVClJGfgQ4EvOFzp-=w2048-h1365-s-no-gm",
      "https://lh3.googleusercontent.com/pw/AP1GczNAQfI50Vsxse9p9SyAVFwqHvXFpu2KQyCaoiQV09yu_5cbHEUyhnMWEB3Boa_j8XB7QbPCCB4uU6TDO4uygKjlWjOWQSxih4sDYxSs7eDqWjMF2n042vwedQpxKoJPMBmZtVLsbKRIZL-USSuHCaoq=w2048-h1365-s-no-gm",
      "https://lh3.googleusercontent.com/pw/AP1GczNw7y-rTd2aSs35bfzL5mdYj7IcUDNXplweiwNP323EB-zawS8H-jBaC3rPhHmHLGcTgPCkMqXRCda0RUguzvkn8jxOP0anSvG3A6gVvB6fYQmdX9KsiAwfOKm3srngXeQ2s50A_YYKcFu5uYZIegZ9=w2048-h1394-s-no-gm",
    ],
  };

  const getNextOpeningTime = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    if (day === 0) {
      return { type: "monday", time: "12:00" };
    }

    if (hour < 12) {
      return { type: "today", time: "12:00" };
    }

    if (hour >= 15 && hour < 19) {
      return { type: "today", time: "19:00" };
    }

    if (hour >= 22 || (hour >= 12 && hour < 15)) {
      if (day === 6 && hour >= 22) {
        return { type: "monday", time: "12:00" };
      }
      return { type: "tomorrow", time: "12:00" };
    }

    return { type: "tomorrow", time: "12:00" };
  };

  const t = content[language];
  const address = "R. Maria Andrade 6B 1170-217 Lisboa";
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address
  )}`;

  useEffect(() => {
    const fetchHeroBannerText = async () => {
      try {
        const query = `*[_type == "banner"][0]{
          heroBanner {
            ${language}
          }
        }`;

        const data = await sanityClient.fetch(query);
        setHeroText(data?.heroBanner?.[language] || "");
      } catch (error) {
        console.error("Error fetching hero banner text:", error);
      }
    };

    fetchHeroBannerText();
  }, [language]);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const query = `*[_type == "heroImage"][0]{ image { asset->{ url } }, altText }`;
        const data = await sanityClient.fetch(query);
        setHeroImage(data);
      } catch (error) {
        console.error("Error fetching hero image:", error);
      }
    };

    fetchHeroImage();
  }, []);

  useEffect(() => {
    const fetchMenuImage = async () => {
      try {
        const query = `*[_type == "menuImage"][0]{ image { asset->{ url } }, altText, caption }`;
        const data = await sanityClient.fetch(query);
        setMenuImage(data);
      } catch (error) {
        console.error("Error fetching menu image:", error);
      }
    };

    fetchMenuImage();
  }, []);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const query = `*[_type == "gallery"][0]{ images[]{ asset->{ url } }, captions }`;
        const data = await sanityClient.fetch(query);
        setGalleryImages(data?.images || []);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    };

    fetchGalleryImages();
  }, []);

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const query = `*[_type == "phoneNumber"][0]{ phone }`;
        const data = await sanityClient.fetch(query);

        if (data && data.phone) {
          setPhoneNumber(data.phone[language] || "");
        } else {
          console.error("Phone data is missing or incorrectly structured");
        }
      } catch (error) {
        console.error("Error fetching phone number:", error);
      }
    };

    fetchPhoneNumber();
  }, [language]);

  useEffect(() => {
    const fetchOpeningHours = async () => {
      try {
        const query = `*[_type == "openingHours"][0]{ hours }`; // Récupérer les horaires
        const data = await sanityClient.fetch(query);
        setOpeningHours(data?.hours || []);
      } catch (error) {
        console.error("Error fetching opening hours:", error);
      }
    };

    fetchOpeningHours();
  }, []);

  useEffect(() => {
    const fetchMenuPdf = async () => {
      try {
        const query = `*[_type == "menu"][0]{ menuFile }`;
        const data = await sanityClient.fetch(query);
        const fileRef = data?.menuFile?.[language]?.asset?._ref;

        if (fileRef) {
          const fileData = await sanityClient.getDocument(fileRef);
          setMenuPdf(fileData?.url || "");
        }
      } catch (error) {
        console.error("Error fetching menu PDF:", error);
      }
    };

    fetchMenuPdf();
  }, [language]);

  useEffect(() => {
    const fetchTransportInfo = async () => {
      try {
        const query = `*[_type == "publicTransport"][0]{ transportInfo }`;
        const data = await sanityClient.fetch(query);
        setTransportInfo(data?.transportInfo || []);
      } catch (error) {
        console.error("Error fetching transport info:", error);
      }
    };

    fetchTransportInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-stone-900 flex items-center justify-center z-50">
        <img
          src={images.logo}
          alt="Carvoaria Jacto Logo"
          className="w-72 h-72 object-contain animate-pulse"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-stone-900/95 shadow-lg backdrop-blur-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={images.logo}
              alt="Carvoaria Jacto Logo"
              className="h-28 w-auto -my-3"
            />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#history"
              className="text-white hover:text-yellow-400 transition"
            >
              {t.nav.history}
            </a>
            <a
              href="#menu"
              className="text-white hover:text-yellow-400 transition"
            >
              {t.nav.menu}
            </a>
            <a
              href="#gallery"
              className="text-white hover:text-yellow-400 transition"
            >
              {t.nav.gallery}
            </a>
            <a
              href="#contact"
              className="text-white hover:text-yellow-400 transition"
            >
              {t.contact.title}
            </a>
            <div className="flex items-center gap-2 text-white">
              <Globe size={16} />
              <button
                onClick={() => setLanguage("pt")}
                className={`px-2 py-1 rounded transition ${
                  language === "pt" ? "bg-yellow-600" : "hover:bg-stone-700"
                }`}
              >
                PT
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded transition ${
                  language === "en" ? "bg-yellow-600" : "hover:bg-stone-700"
                }`}
              >
                EN
              </button>
            </div>
          </div>
          <a
            href="tel:+351218147555"
            className="bg-yellow-600 text-white px-4 py-2 rounded-full hover:bg-yellow-700 transition flex items-center gap-2"
          >
            <PhoneCall size={16} />
            <span className="hidden sm:inline">{t.nav.book}</span>
          </a>
        </div>
      </nav>

      <header className="relative h-screen">
        {heroImage ? (
          <div className="absolute inset-0">
            <img
              src={urlFor(heroImage.image).url()}
              alt={heroImage.altText || "Hero Banner Image"}
              className="w-full h-full object-cover animate-kenburns"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h2 className="text-5xl font-bold text-white mb-6 animate-fade-in">
            Carvoaria Jacto
          </h2>
          <p className="text-xl text-white mb-4 animate-slide-up">
            {t.hero.subtitle}
          </p>
          <p
            className={`text-xl mb-8 text-yellow-400 animate-slide-up delay-200`}
          >
            {heroText}
          </p>
          <div className="flex gap-4 animate-slide-up delay-300">
            <a
              href="tel:+351218147555"
              className="bg-yellow-600 text-white px-8 py-3 rounded-full hover:bg-yellow-700 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <PhoneCall size={20} />
              {t.nav.book}
            </a>
          </div>
        </div>
      </header>

      <section
        id="history"
        className={`py-20 px-8 bg-white transition-all duration-1000 transform ${
          isVisible.history
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold mb-6">{t.history.title}</h3>
            <p className="text-gray-600 leading-relaxed">{t.history.content}</p>
          </div>
          {storyImage ? (
            <div>
              <img
                src={urlFor(storyImage.image).url()}
                alt={storyImage.altText || "Our Story Image"}
                className="rounded-lg shadow-xl"
              />
              {storyImage.caption && (
                <p className="mt-2 text-center">{storyImage.caption}</p>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </section>

      <section
        id="menu"
        className={`py-20 px-8 bg-stone-100 transition-all duration-1000 transform ${
          isVisible.menu
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            {t.menu.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              {menuImage ? (
                <div>
                  <img
                    src={urlFor(menuImage.image).url()}
                    alt={menuImage.altText || "Menu Image"}
                    className="rounded-lg shadow-xl w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {menuImage.caption && (
                    <p className="mt-2 text-center">{menuImage.caption}</p>
                  )}
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="flex flex-col items-center md:items-start space-y-6">
              <a
                href={menuPdf}
                target="_blank"
                className="bg-yellow-600 text-white px-8 py-4 rounded-full hover:bg-yellow-700 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-3 text-lg"
              >
                <FileText size={24} />
                {language === "en"
                  ? "Discover our Menu"
                  : "Descubra o nosso Menu"}
              </a>
              <p className="text-gray-600 text-center md:text-left">
                {t.menu.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="gallery"
        className={`py-20 px-8 bg-white transition-all duration-1000 transform ${
          isVisible.gallery
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            {t.gallery.title}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg shadow-lg group"
              >
                <img
                  src={urlFor(image).url()}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-8 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            {t.reviews.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.reviews.testimonials.map((review, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{review.text}</p>
                <div className="mt-4">
                  <p className="font-semibold">{review.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className={`py-20 px-8 bg-stone-100 transition-all duration-1000 transform ${
          isVisible.contact
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            {t.contact.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <MapPin className="text-yellow-600" />
                    {t.contact.address}
                  </h4>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-yellow-600 transition-colors flex items-center gap-2"
                  >
                    {address}
                    <ExternalLink size={16} />
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Phone className="text-yellow-600" />
                    {t.contact.phone}
                  </h4>
                  <a
                    href={`tel:${phoneNumber}`}
                    className="text-gray-600 hover:text-yellow-600 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    {phoneNumber}
                    <PhoneCall
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="space-y-6">
                {openingHours.map((hour, index) => (
                  <div key={index}>
                    {!hour.closed ? (
                      <p className="text-gray-600">
                        {language === "en" ? `${hour.en}` : `${hour.pt}`}
                      </p>
                    ) : (
                      <p className="text-gray-600">
                        {language === "en" ? "Closed" : "Fechado"}
                      </p>
                    )}
                  </div>
                ))}
                <div>
                  <h4 className="font-semibold text-lg mb-4">
                    {t.contact.publicTransport}
                  </h4>
                  {transportInfo.map((info, index) => (
                    <div key={index}>
                      {info.metro && (
                        <p className="text-gray-600">
                          {language === "en" ? info.metro.en : info.metro.pt}
                        </p>
                      )}
                      {info.bus && (
                        <p className="text-gray-600">
                          {language === "en" ? info.bus.en : info.bus.pt}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.7098855455397!2d-9.1397!3d38.7239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1933a3bf58649d%3A0x4c0e79b37d357f85!2sR.%20Maria%20Andrade%206B%2C%201170-217%20Lisboa%2C%20Portugal!5e0!3m2!1sen!2s!4v1635959562000!5m2!1sen!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <footer className="bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">{t.footer.about}</h4>
              <p className="text-stone-400 mb-4">{t.footer.aboutText}</p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4">{t.contact.title}</h4>
              <div className="space-y-2 text-stone-400">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
                >
                  <MapPin size={16} />
                  {address}
                  <ExternalLink size={14} />
                </a>
                <a
                  href={`tel:${phoneNumber}`}
                  className="text-stone-400 hover:text-yellow-600 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {phoneNumber}
                  <PhoneCall
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4">{t.footer.hours}</h4>
              <div className="space-y-2 text-stone-400">
                {openingHours.map((hour, index) => (
                  <div key={index}>
                    {!hour.closed ? (
                      <p className="text-stone-400">
                        {language === "en" ? `${hour.en}` : `${hour.pt}`}
                      </p>
                    ) : (
                      <p className="text-gray-600">
                        {language === "en" ? "Closed" : "Fechado"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="py-6 border-t border-stone-800 flex flex-col items-center gap-4">
            <div className="text-stone-400 text-sm">
              © {new Date().getFullYear()} Carvoaria Jacto. {t.footer.rights}.
            </div>
            <div className="text-stone-500 text-sm text-center">
              Designed with Passion by{" "}
              <a
                href="https://gosite-web.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-600 hover:text-yellow-500 transition"
              >
                GOSITE-WEB
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
