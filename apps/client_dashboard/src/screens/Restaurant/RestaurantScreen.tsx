import { IRestaurantPrivate } from '@yori/types/src/core/restaurant';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormButton from '../../components/FormButton/FormButton';
import FormLabel from '../../components/FormLabel/FormLabel';
import FormTextArea from '../../components/FormTextArea/FormTextArea';
import FormTextInput from '../../components/FormTextInput/FormTextInput';
import HorizontalSeparator from '../../components/HorizontalSeparator/HorizontalSeparator';
import ImageSelector from '../../components/ImageSelector/ImageSelector';
import { NavigationBarPage } from '../../components/NavigationBar/NavigationBar';
import FormFieldContainer from '../../containers/FormFieldContainer/FormFieldContainer';
import Page from '../../containers/Page/Page';
import { Restaurant } from '../../utils/api';
import styles from './RestaurantScreen.module.css';
import { generateTemporaryId } from '../../utils/id_util';
import FloatingDeleteButton from '../../components/FloatingDeleteButton/FloatingDeleteButton';

export default function RestaurantScreen() {
  const { restaurantId } = useParams();

  // TODO: show 404 page
  if (restaurantId === undefined) throw new Error('restaurantId is undefined');

  const [edited, setEdited] = useState<boolean>(false);
  const [restaurant, setRestaurant] = useState<IRestaurantPrivate | null>(null);
  const [imagePendingUpload, setImagePendingUpload] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (updatedRestaurant: IRestaurantPrivate) => {
    setEdited(true);
    setRestaurant(updatedRestaurant);
  };

  const saveChanges = async () => {
    if (restaurant) {
      setSaving(true);
      await Restaurant.update(restaurant, imagePendingUpload || undefined);
      setEdited(false);
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      const response = await Restaurant.readPrivate(restaurantId);
      setRestaurant(response.restaurant);
    };
    fetchRestaurant();
  }, [restaurantId]);

  const handleImageChange = (file: File) => {
    setImagePendingUpload(file);
    if (restaurant) {
      handleChange({ ...restaurant, imageUrl: URL.createObjectURL(file) });
    }
  };

  if (!restaurant) return null;

  return (
    <Page activePage={NavigationBarPage.General}>
      <div className={styles.container}>
        <h2>General</h2>
        <HorizontalSeparator />
        <FormFieldContainer>
          <FormLabel label="Restaurant Image" />
          <ImageSelector imageUrl={restaurant.imageUrl} onChange={handleImageChange} />
        </FormFieldContainer>
        <FormTextInput
          label="Name"
          value={restaurant.name || ''}
          onChange={(value) => {
            if (!restaurant) return;
            handleChange({ ...restaurant, name: value });
          }}
        />
        <FormTextArea
          label="Description"
          value={restaurant.description || ''}
          onChange={(value) => {
            if (!restaurant) return;
            handleChange({ ...restaurant, description: value });
          }}
        />
        <FormFieldContainer>
          <FormLabel label="Tables" />
          {/* TODO: make this pretty */}
          {restaurant.tables.map((table) => (
            <div className={styles.tableContainer} key={table.id}>
              <FormTextInput
                label="Table Name"
                value={table.name}
                onChange={(value) => {
                  handleChange({
                    ...restaurant,
                    tables: restaurant.tables.map((t) => {
                      if (t.id === table.id) {
                        return { ...t, name: value };
                      }
                      return t;
                    })
                  });
                }}
              />
              <FloatingDeleteButton
                onClick={() => {
                  handleChange({
                    ...restaurant,
                    tables: restaurant.tables.filter((t) => t.id !== table.id)
                  });
                }}
              />
            </div>
          ))}
          <FormButton
            text="Add Table"
            onClick={() => {
              handleChange({
                ...restaurant,
                tables: [
                  ...restaurant.tables,
                  { id: generateTemporaryId(), name: '', restaurantId: restaurant.id }
                ]
              });
            }}
          />
        </FormFieldContainer>
        {edited && (
          <FormButton floating text="Save Changes" loading={saving} onClick={saveChanges} />
        )}
      </div>
    </Page>
  );
}
