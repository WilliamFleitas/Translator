import DeepgramKey from '../../../../../assets/tutorialImages/deepgramAPIKEY.avif'
import CreateSubs1 from '../../../../../assets/tutorialImages/createSubscription1.avif'
import AddNewSubscription from '../../../../../assets/tutorialImages/addNewSubscription.avif'
import CreateResourceGroup1 from '../../../../../assets/tutorialImages/createResourceGroup1.avif'
import CreateResourceGroup2 from '../../../../../assets/tutorialImages/createResourceGroup2.avif'
import SelectTranslatorProduct from '../../../../../assets/tutorialImages/selectTranslatorProduct.avif'
import SelectPricing from '../../../../../assets/tutorialImages/selectPricingTierForTranslator.avif'
import PickAzureKey from '../../../../../assets/tutorialImages/pickTranslatorAPIKey.avif'
import { useState } from 'react'
import ZoomableImage from './ZoomableImage'

const TranslatorTutorial = (): React.ReactElement => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageClick = (src: string): void => {
    setSelectedImage(src)
  }

  const closeModal = (): void => {
    setSelectedImage(null)
  }
  return (
    <article className="flex flex-col text-start items-start justify-start px-6 pt-6 pb-10 gap-4">
      <header>
        <h2 className="text-3xl font-bold">How to get your API Key</h2>
      </header>

      <section className="flex flex-col text-start items-start justify-start gap-4">
        <h2 className="text-2xl font-bold">Deepgram API Key</h2>
        <p className="text-xl">
          {`Create your Deepgram account. After signing up, Deepgram will give you $200 in credits to
          try their API. Once you're inside the dashboard, just click on "Create API Key" and you'll
          be ready to use it.`}
        </p>
        <img
          className="flex object-fit w-full h-fit  cursor-zoom-in"
          src={DeepgramKey}
          alt="Deepgram Dashboard for API Key"
          onClick={() => handleImageClick(DeepgramKey)}
        />
      </section>
      <section className="flex flex-col text-start items-start justify-start gap-4">
        <h2 className="text-2xl font-bold">Azure AI Translator API Key</h2>
        <h2 className="text-2xl font-bold">1 - Create your Azure Account</h2>
        <p className="text-xl">
          {`Go to portal.azure.com to create your account. You’ll need to provide the required details (including a credit card for verification, but nothing will be charged on the free plan).`}
        </p>
        <h2 className="text-2xl font-bold">2 - Set up your environment</h2>
        <p className="text-xl">{`Once you're inside the Azure portal, you'll need to set up your environment.`}</p>
        <p className="text-xl">{`- First, create a subscription for your account.`}</p>
        <img
          className="flex object-fit w-full h-fit  cursor-zoom-in"
          src={CreateSubs1}
          alt="Create Azure Subscription"
          onClick={() => handleImageClick(CreateSubs1)}
        />
        <p className="text-xl">{`- Click on "Add New Subscription." In the Basics tab, enter your subscription name and select "Free Trial" as your plan. After that, click "Review + Create."`}</p>
        <img
          className="flex object-fit w-full h-fit  cursor-zoom-in"
          src={AddNewSubscription}
          alt="Add new Subscription"
          onClick={() => handleImageClick(AddNewSubscription)}
        />
        <p className="text-xl">{`- Once your subscription is created, you’ll need to create a Resource Group. This group allows you to use Microsoft products from the marketplace. Click on "Add New Resource Group," enter a name for the group, select the region that corresponds to your country, and click "Review + Create."`}</p>
        <img
          className="flex object-fit w-full h-fit  cursor-zoom-in"
          src={CreateResourceGroup1}
          alt="Create Resource Group"
          onClick={() => handleImageClick(CreateResourceGroup1)}
        />
        <img
          className="flex object-fit w-full h-fit  cursor-zoom-in"
          src={CreateResourceGroup2}
          alt="Create Resource Group with subscription and Region"
          onClick={() => handleImageClick(CreateResourceGroup2)}
        />
        <p className="text-xl">{`- After creating your Resource Group, go to it. Inside your Resource Group, click on "Create New Resource." This will take you to the marketplace, where you'll need to search for the Azure AI Translator product.`}</p>
        <img
          className="flex object-fit w-full h-fit  cursor-zoom-in"
          src={SelectTranslatorProduct}
          alt="Select Translator Product on the Azure Marketplace"
          onClick={() => handleImageClick(SelectTranslatorProduct)}
        />
        <p className="text-xl">{`- Click on the Translator product. On the next screen, select your subscription and plan, then click "Create." You’ll need to choose a Region, Name, and Pricing Tier (important: select Free F0, which is the free monthly tier that gives you 2 million characters per month). Then, click "Review + Create."`}</p>
        <img
          className="flex object-fit w-full h-fit  cursor-zoom-in"
          src={SelectPricing}
          alt="Select your pricing tier for the Translator Product"
          onClick={() => handleImageClick(SelectPricing)}
        />
        <p className="text-xl">{`- After completing all those steps, go to your Translator service and you’ll be able to retrieve your API Key from there.`}</p>
        <img
          className="flex object-cover w-full h-fit  cursor-zoom-in"
          src={PickAzureKey}
          alt="Pick your Azure Translator API Key"
          onClick={() => handleImageClick(PickAzureKey)}
        />
      </section>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="flex flex-col text-start items-center justify-center w-fit h-fit max-h-[70%]"
            onClick={(e) => e.stopPropagation()}
          >
            <ZoomableImage src={selectedImage} alt="expanded image" />
          </div>
        </div>
      )}
    </article>
  )
}

export default TranslatorTutorial
