import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type profile = {
  name: string;
  email: string;
  phone: string;
};

export default function ProfileScreen() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [profile, setProfile] = useState<profile>({
    name: "User",
    email: "user@example.com",
    phone: "+91 98765 43210",
  });

  const handlePress = (title: string) => {
    Alert.alert(title, `${title} screen will open here.`);
  };

  const loadProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem("profile");
      const userData = await AsyncStorage.getItem("user");

      let name = "";
      let email = "";
      let phone = "+91 98765 43210";

      if (userData) {
        const parsedUser = JSON.parse(userData);
        name = parsedUser.name || "";
        email = parsedUser.email || "";
      }

      if (profileData) {
        const parsedProfile = JSON.parse(profileData);
        if (parsedProfile.name) name = parsedProfile.name;
        if (parsedProfile.email) email = parsedProfile.email;
        if (parsedProfile.phone) phone = parsedProfile.phone;
      }

      setProfile({
        name: name || "User",
        email: email || "user@example.com",
        phone,
      });
    } catch (error) {
      console.log("Error loading profile:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.setItem("loggedIn", "false");
            router.replace("/login");
          } catch (error) {
            console.log("Logout error:", error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: "transparent",
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text
          style={[
            styles.headerTitle,
            {
              color: isDarkMode ? "#FFFFFF" : "#0F172A",
            },
          ]}
        >
          Profile
        </Text>

        {/* Profile Header */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            },
          ]}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://i.pravatar.cc/300",
              }}
              style={styles.avatar}
            />

            <Pressable style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </Pressable>
          </View>

          <Text
            style={[
              styles.name,
              {
                color: isDarkMode ? "#FFFFFF" : "#0F172A",
              },
            ]}
          >
            {profile.name}
          </Text>

          <Text
            style={[
              styles.email,
              {
                color: isDarkMode ? "#9CA3AF" : "#64748B",
              },
            ]}
          >
            {profile.email}
          </Text>

          <Pressable
            style={styles.editProfileButton}
            onPress={() => router.push("/edit-profile")}
          >
            <Ionicons name="create-outline" size={17} color="#2563EB" />

            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Personal Information */}
        <SectionTitle title="Personal Information" />

        <View
          style={[
            styles.section,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            },
          ]}
        >
          <MenuItem
            icon="create-outline"
            title="Edit Personal Information"
            onPress={() => router.push("/edit-profile")}
            showDivider={false}
          />

          <MenuItem
            icon="create-outline"
            title="My Account"
            onPress={() => router.push("/accounts")}
            showDivider={false}
          />
        </View>

        {/* Expense Settings */}
        <SectionTitle title="Expense Settings" />

        <View
          style={[
            styles.section,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            },
          ]}
        >
          <MenuItem
            icon="cash-outline"
            title="Default Currency"
            value="₹ INR"
            onPress={() => handlePress("Currency")}
          />

          <MenuItem
            icon="swap-horizontal-outline"
            title="Default Transaction Type"
            value="Expense"
            onPress={() => handlePress("Default Transaction Type")}
          />

          <MenuItem
            icon="list-outline"
            title="Categories"
            onPress={() => handlePress("Categories")}
          />

          <MenuItem
            icon="wallet-outline"
            title="Monthly Budget"
            value="₹ 30,000"
            onPress={() => router.push("/monthly-budget")}
            showDivider={false}
          />
        </View>

        {/* Appearance */}
        <SectionTitle title="Appearance" />

        <View
          style={[
            styles.section,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            },
          ]}
        >
          <MenuItem
            icon="moon-outline"
            title="Dark Mode"
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={() => toggleDarkMode()}
                trackColor={{
                  false: "#CBD5E1",
                  true: "#93C5FD",
                }}
                thumbColor={isDarkMode ? "#2563EB" : "#F8FAFC"}
              />
            }
          />

          <MenuItem
            icon="phone-portrait-outline"
            title="System Default"
            onPress={() => handlePress("System Default")}
            showDivider={false}
          />
        </View>

        {/* Security */}
        <SectionTitle title="Security" />

        <View
          style={[
            styles.section,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            },
          ]}
        >
          <MenuItem
            icon="key-outline"
            title="Change Password"
            onPress={() => router.push("/change-password")}
          />

          <MenuItem
            icon="lock-closed-outline"
            title="Set PIN"
            onPress={() => router.push("/app-lock")}
          />

          <MenuItem
            icon="lock-closed-outline"
            title=" Change PIN"
            onPress={() => router.push("/change-pin")}
          />
        </View>

        {/* Other */}
        <SectionTitle title="Other" />

        <View
          style={[
            styles.section,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            },
          ]}
        >
          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => router.push("/help-support")}
          />

          <MenuItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            onPress={() => router.push("/privacy-policy")}
          />

          <MenuItem
            icon="information-circle-outline"
            title="About Expense Tracker"
            onPress={() => router.push("/about-expense-tracker")}
            showDivider={false}
          />
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={21} color="#DC2626" />

          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.version}>Expense Tracker v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------- */
/* Section Title                    */
/* -------------------------------- */
function SectionTitle({ title }: { title: string }) {
  const { isDarkMode } = useTheme();

  return (
    <Text
      style={[
        styles.sectionTitle,
        {
          color: isDarkMode ? "#D1D5DB" : "#475569",
        },
      ]}
    >
      {title}
    </Text>
  );
}

/* -------------------------------- */
/* Menu Item                        */
/* -------------------------------- */

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showDivider?: boolean;
};

function MenuItem({
  icon,
  title,
  value,
  onPress,
  rightComponent,
  showDivider = true,
}: MenuItemProps) {
  const { isDarkMode } = useTheme();
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isDarkMode ? "#1F2937" : "#EFF6FF",
            },
          ]}
        >
          <Ionicons name={icon} size={20} color="#2563EB" />
        </View>

        <View style={styles.menuTextContainer}>
          <Text
            style={[
              styles.menuTitle,
              {
                color: isDarkMode ? "#FFFFFF" : "#1E293B",
              },
            ]}
          >
            {title}
          </Text>

          {value && (
            <Text
              style={[
                styles.menuValue,
                {
                  color: isDarkMode ? "#9CA3AF" : "#64748B",
                },
              ]}
            >
              {value}
            </Text>
          )}
        </View>
      </View>

      {rightComponent ? (
        rightComponent
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
      )}

      {showDivider && (
        <View
          style={[
            styles.divider,
            {
              backgroundColor: isDarkMode ? "#374151" : "#F1F5F9",
            },
          ]}
        />
      )}
    </Pressable>
  );
}

/* -------------------------------- */
/* Styles                           */
/* -------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    paddingBottom: 40,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    paddingLeft: 22,
  },

  /* Profile */

  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 18,
    paddingVertical: 25,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#DBEAFE",
  },

  cameraButton: {
    position: "absolute",
    right: -2,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  name: {
    fontSize: 21,
    fontWeight: "700",
    color: "#0F172A",
  },

  email: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },

  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 15,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
  },

  editProfileText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Sections */

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 9,
  },

  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: "hidden",
  },

  menuItem: {
    minHeight: 64,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  menuTextContainer: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },

  menuValue: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },

  divider: {
    position: "absolute",
    bottom: 0,
    left: 65,
    right: 0,
    height: 1,
    backgroundColor: "#F1F5F9",
  },

  /* Logout */

  logoutButton: {
    marginHorizontal: 16,
    marginTop: 28,
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  logoutText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "700",
  },

  version: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 18,
  },
});
