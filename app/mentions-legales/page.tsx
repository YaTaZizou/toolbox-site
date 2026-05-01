import Link from "next/link";

export default function MentionsLegales() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10">Mentions légales</h1>

      <div className="space-y-8 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Éditeur du site</h2>
          <p>Le site ToolBox (accessible à l&apos;adresse https://alltoolbox.fr) est édité par :</p>
          <ul className="mt-3 space-y-1 text-gray-400">
            <li><span className="text-gray-300">Éditeur :</span> Elias Benabdelkader</li>
            <li><span className="text-gray-300">Email :</span> contact@alltoolbox.fr</li>
            <li><span className="text-gray-300">Adresse :</span> 13 Rue de la Justice, 91290 Arpajon, France</li>
            <li><span className="text-gray-300">SIRET :</span> 942 985 755 00019</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Directeur de la publication</h2>
          <ul className="mt-3 space-y-1 text-gray-400">
            <li><span className="text-gray-300">Directeur de la publication :</span> Elias Benabdelkader</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Hébergement</h2>
          <p>Le site est hébergé par :</p>
          <ul className="mt-3 space-y-1 text-gray-400">
            <li><span className="text-gray-300">Société :</span> Vercel Inc.</li>
            <li><span className="text-gray-300">Adresse :</span> 340 Pine Street, Suite 1506, San Francisco, CA 94104, États-Unis</li>
            <li><span className="text-gray-300">Contact légal :</span> legal@vercel.com</li>
            <li>
              <span className="text-gray-300">Site web :</span>{" "}
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
                https://vercel.com
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Protection des données personnelles</h2>
          <p>Le traitement des données personnelles des utilisateurs est détaillé dans notre <Link href="/confidentialite" className="text-purple-400 underline hover:text-white transition-colors">politique de confidentialité</Link>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Propriété intellectuelle</h2>
          <p>L&apos;ensemble du contenu de ce site (textes, graphiques, logos, icônes) est la propriété exclusive de ToolBox. Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est interdite.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Responsabilité</h2>
          <p>ToolBox s&apos;efforce de fournir des informations exactes et à jour. Cependant, nous ne pouvons garantir l&apos;exactitude, la complétude ou l&apos;actualité des informations diffusées sur ce site. L&apos;utilisation des outils proposés se fait sous la responsabilité de l&apos;utilisateur.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Médiation de la consommation</h2>
          <p>
            Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, vous pouvez recourir à la plateforme de règlement en ligne des litiges (RLL) proposée par la Commission européenne :
          </p>
          <p className="mt-3">
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              https://ec.europa.eu/consumers/odr
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Droit applicable</h2>
          <p>Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </section>

        <p className="text-gray-600 text-sm pt-4 border-t border-gray-800">Dernière mise à jour : mai 2026</p>
      </div>
    </div>
  );
}
