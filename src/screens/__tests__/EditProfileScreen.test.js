import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { useUser } from "../../context/UserContext";
import { updateProfile, uploadProfileImage } from "../../services/userService";
import EditProfileScreen from "../EditProfileScreen";

jest.mock("../../context/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("../../services/userService", () => ({
  updateProfile: jest.fn(),
  uploadProfileImage: jest.fn(),
}));

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock("../../components/DatePickerField", () => {
  const { TouchableOpacity, Text, Alert } = require("react-native");
  return function MockDatePickerField(props) {
    return (
      <TouchableOpacity
        testID="dob-field"
        onPress={() => props.onChange(new Date("2001-06-15"))}
      >
        <Text>{props.value ? props.value.toDateString() : "Select Date"}</Text>
      </TouchableOpacity>
    );
  };
});

const baseProfile = {
  firstName: "Jane",
  lastName: "Doe",
  dob: "2000-01-01",
  photoURL: null,
  major: "cs",
  level: "junior",
  gpa: 3.7,
  email: "jane.doe@example.edu",
  collegeName: "State University",
};

const setup = (profileOverrides = {}) => {
  useUser.mockReturnValue({ profile: { ...baseProfile, ...profileOverrides } });
  const navigation = { goBack: jest.fn() };
  const utils = render(<EditProfileScreen navigation={navigation} />);
  return { ...utils, navigation };
};

describe("EditProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  if (
    ("renders profile fields from context",
    () => {
      const { getByPlaceholderText, getByText } = setup();

      expect(getByPlaceholderText("First Name").props.value).toBe("Jane");
    })
  );
});
