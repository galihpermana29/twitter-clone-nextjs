import axios from 'axios';

const uploadPic = async (media) => {
	try {
		const form = new FormData();
		form.append('file', media);
		form.append('upload_preset', 'social_media');
		form.append('cloud_name', 'braiwjaya-university');

		const res = await axios.post(process.env.CLOUDINARY_URL, form);
		return res.data.url;
	} catch (err) {
		return;
	}
};

export default uploadPic;
