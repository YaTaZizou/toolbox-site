export default function Confidentialite() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10">Politique de confidentialité</h1>

      <div className="space-y-8 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Données collectées</h2>
          <p>ToolBox collecte les données suivantes :</p>
          <ul className="mt-3 space-y-2 text-gray-400 list-disc list-inside">
            <li><span className="text-gray-300">Adresse email</span> — lors de la création d'un compte</li>
            <li><span className="text-gray-300">Données de paiement</span> — gérées exclusivement par Stripe (nous ne stockons aucune carte bancaire)</li>
            <li><span className="text-gray-300">Données de navigation</span> — via Google AdSense (cookies publicitaires)</li>
            <li><span className="text-gray-300">Fichiers uploadés</span> — images et PDF traités temporairement puis supprimés immédiatement</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Utilisation des données</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul className="mt-3 space-y-2 text-gray-400 list-disc list-inside">
            <li>Gérer votre compte et votre abonnement</li>
            <li>Traiter vos paiements via Stripe</li>
            <li>Afficher des publicités personnalisées via Google AdSense</li>
            <li>Améliorer les services proposés</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Cookies</h2>
          <p>Ce site utilise des cookies, notamment :</p>
          <ul className="mt-3 space-y-2 text-gray-400 list-disc list-inside">
            <li><span className="text-gray-300">Cookies de session</span> — pour maintenir votre connexion</li>
            <li><span className="text-gray-300">Cookies publicitaires</span> — via Google AdSense pour afficher des publicités adaptées</li>
          </ul>
          <p className="mt-3">Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, mais certaines fonctionnalités du site pourraient ne plus fonctionner correctement.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Services tiers</h2>
          <ul className="mt-3 space-y-3 text-gray-400">
            <li><span className="text-gray-300">Supabase</span> — stockage sécurisé des données utilisateurs (supabase.com)</li>
            <li><span className="text-gray-300">Stripe</span> — traitement des paiements (stripe.com)</li>
            <li><span className="text-gray-300">Google AdSense</span> — affichage de publicités (google.com/adsense)</li>
            <li><span className="text-gray-300">Anthropic</span> — génération de texte par IA (anthropic.com)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Conservation des données</h2>
          <p>Vos données sont conservées tant que votre compte est actif. Vous pouvez demander la suppression de votre compte et de toutes vos données en nous contactant par email.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Vos droits (RGPD)</h2>
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
          <ul className="mt-3 space-y-2 text-gray-400 list-disc list-inside">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement (droit à l'oubli)</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition au traitement</li>
          </ul>
          <p className="mt-3">Pour exercer ces droits, contactez-nous à : <span className="text-purple-400">yatazcontact@gmail.com</span></p>
        </section>

        <p className="text-gray-600 text-sm pt-4 border-t border-gray-800">Dernière mise à jour : avril 2026</p>
      </div>
    </div>
  );
}
