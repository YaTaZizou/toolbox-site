export default function MentionsLegales() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10">Mentions légales</h1>

      <div className="space-y-8 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Éditeur du site</h2>
          <p>Le site ToolBox (accessible à l'adresse https://toolbox-site-blue.vercel.app) est édité par :</p>
          <ul className="mt-3 space-y-1 text-gray-400">
            <li><span className="text-gray-300">Nom :</span> Elias Benabdelkader</li>
            <li><span className="text-gray-300">Ville :</span> Arpajon, 91290</li>
            <li><span className="text-gray-300">Email :</span> yatazcontact@gmail.com</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Hébergement</h2>
          <p>Le site est hébergé par :</p>
          <ul className="mt-3 space-y-1 text-gray-400">
            <li><span className="text-gray-300">Société :</span> Vercel Inc.</li>
            <li><span className="text-gray-300">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</li>
            <li><span className="text-gray-300">Site web :</span> vercel.com</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Propriété intellectuelle</h2>
          <p>L'ensemble du contenu de ce site (textes, graphiques, logos, icônes) est la propriété exclusive de Elias Benabdelkader. Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est interdite.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Responsabilité</h2>
          <p>ToolBox s'efforce de fournir des informations exactes et à jour. Cependant, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations diffusées sur ce site. L'utilisation des outils proposés se fait sous la responsabilité de l'utilisateur.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Droit applicable</h2>
          <p>Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </section>

        <p className="text-gray-600 text-sm pt-4 border-t border-gray-800">Dernière mise à jour : avril 2026</p>
      </div>
    </div>
  );
}
