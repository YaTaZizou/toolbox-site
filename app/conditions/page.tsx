export default function Conditions() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10">Conditions d'utilisation</h1>

      <div className="space-y-8 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Acceptation des conditions</h2>
          <p>En accédant et en utilisant le site ToolBox, vous acceptez sans réserve les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Description du service</h2>
          <p>ToolBox est une plateforme en ligne proposant :</p>
          <ul className="mt-3 space-y-2 text-gray-400 list-disc list-inside">
            <li>Des générateurs de contenu basés sur l'intelligence artificielle (pseudo, bio, texte)</li>
            <li>Des outils de conversion de fichiers (images, PDF)</li>
            <li>Un abonnement Premium permettant de supprimer les publicités</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Compte utilisateur</h2>
          <p>Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités effectuées depuis votre compte. Vous vous engagez à fournir des informations exactes lors de l'inscription.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Abonnement Premium</h2>
          <ul className="mt-3 space-y-2 text-gray-400 list-disc list-inside">
            <li>L'abonnement Premium est proposé au tarif de <span className="text-white">2,99€/mois</span></li>
            <li>Le paiement est prélevé automatiquement chaque mois</li>
            <li>Vous pouvez résilier à tout moment depuis votre espace client</li>
            <li>Aucun remboursement ne sera effectué pour un mois entamé</li>
            <li>Les paiements sont sécurisés via Stripe</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Utilisation acceptable</h2>
          <p>Vous vous engagez à ne pas utiliser ToolBox pour :</p>
          <ul className="mt-3 space-y-2 text-gray-400 list-disc list-inside">
            <li>Générer du contenu illégal, diffamatoire, obscène ou offensant</li>
            <li>Violer les droits de propriété intellectuelle de tiers</li>
            <li>Tenter de pirater ou de perturber le fonctionnement du site</li>
            <li>Utiliser des robots ou scripts automatisés sans autorisation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Limitation de responsabilité</h2>
          <p>ToolBox est fourni "tel quel" sans garantie d'aucune sorte. Nous ne sommes pas responsables des dommages directs ou indirects résultant de l'utilisation du site. Le contenu généré par l'IA est automatique et ToolBox ne peut être tenu responsable de son utilisation.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Publicités</h2>
          <p>Le site affiche des publicités via Google AdSense pour les utilisateurs non abonnés. Ces publicités sont soumises aux politiques de Google. Vous pouvez supprimer les publicités en souscrivant à l'abonnement Premium.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Modification des conditions</h2>
          <p>ToolBox se réserve le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur le site. Il vous appartient de consulter régulièrement cette page.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">9. Contact</h2>
          <p>Pour toute question relative aux présentes conditions, contactez-nous à : <span className="text-purple-400">yatazcontact@gmail.com</span></p>
        </section>

        <p className="text-gray-600 text-sm pt-4 border-t border-gray-800">Dernière mise à jour : avril 2026</p>
      </div>
    </div>
  );
}
